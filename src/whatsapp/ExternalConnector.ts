// import browser from "webextension-polyfill";
// see https://github.com/mozilla/webextension-polyfill/issues/316
import {BridgePortType, InternalBusEvent, InternalEvent, WWAProviderCall, WWAProviderRequest} from "./types";
import {generateBasicWWAResponse} from "./Utils";
import {
  getChat,
  getChatByTitle,
  openChat,
  synchronizeWWChats,
  getChatsExceptId,
  getOpenedChat,
  setChatsGlobalSoundsState,
  getChatsGlobalSoundsState,
  markChatAsRead,
  getProfilePicUrl,
  getUnreadChats,
  getChats,
  markChatUnread,
  runAutoReconnecting
} from "./WWAController";
import {ChatModule, ConnModule, provideModules, SocketModule} from "./WWAProvider";
import {Chat} from "./model/Chat";
import {ChatFabric} from "./ChatFabric";
import {
  retentionArchiveChatLocally,
  retentionMuteChatLocally,
  stopRetentionArchiveChatLocally,
  stopRetentionMuteChatLocally
} from "./RetentionArchiveChat";
// @ts-ignore
const browser = chrome;



const callerFunctions = new Map<WWAProviderCall, any>();

callerFunctions.set(WWAProviderCall.findChatByTitle, (chatTitle: string): Chat | null => {
  const chat = getChatByTitle(chatTitle);
  return chat
    ? ChatFabric.fromWWAChat(chat)
    : null; // e.g.: Phone contact without WhatsApp chat
});

callerFunctions.set(WWAProviderCall.updateChatModels, (chats: Chat[]) => {
  return chats.map((chat: Chat) => {
    const updatedWWAChat = getChat(chat.id);
    return ChatFabric.fromWWAChat(updatedWWAChat);
  });
});


callerFunctions.set(WWAProviderCall.muteChatLocally, (chat: Chat): any => {
  retentionMuteChatLocally(chat.id);
});

callerFunctions.set(WWAProviderCall.unmuteChatsLocally, (chats: Chat[]): any => {
  for (const chat of chats)
    stopRetentionMuteChatLocally(chat.id);
});

callerFunctions.set(WWAProviderCall.muteNonMutedChatsExceptChat, (chat: Chat) => {
  const WWAChatsForMute = getChatsExceptId(chat.id.toString());
  // Mute non muted chats
  WWAChatsForMute.forEach(chat => retentionMuteChatLocally(chat.id));

  return WWAChatsForMute.map(ChatFabric.fromWWAChat);
});

callerFunctions.set(WWAProviderCall.archiveChatLocally, (chat: Chat): void => {
  retentionArchiveChatLocally(chat.id);
});

callerFunctions.set(WWAProviderCall.unArchiveChatLocally, (chat: Chat): void => {
  stopRetentionArchiveChatLocally(chat.id);
});

callerFunctions.set(WWAProviderCall.getChatById, (chatId: string) => {
  const chat = getChat(chatId);
  return ChatFabric.fromWWAChat(chat);
});

callerFunctions.set(WWAProviderCall.openChat, (chat: Chat): Chat => {
  const WWAChat = openChat(chat.id);
  return ChatFabric.fromWWAChat(WWAChat);
});

callerFunctions.set(WWAProviderCall.getOpenedChat, () => {
  const chat = getOpenedChat();
  return chat ? ChatFabric.fromWWAChat(chat) : null;
});

callerFunctions.set(WWAProviderCall.refreshWWChats, async () => {
  await synchronizeWWChats();
});

callerFunctions.set(WWAProviderCall.setChatsSounds, (state: boolean) => {
  setChatsGlobalSoundsState(state);
});

callerFunctions.set(WWAProviderCall.getChatsSoundsState, () => {
  return getChatsGlobalSoundsState();
});

callerFunctions.set(WWAProviderCall.markChatAsRead, (chatId: string) => {
  markChatAsRead(chatId)
});

callerFunctions.set(WWAProviderCall.markChatUnread, (chatId: string) => {
  markChatUnread(chatId);
});

callerFunctions.set(WWAProviderCall.getProfilePicUrl, async (chat: Chat): Promise<string | undefined> => {
  return await getProfilePicUrl(chat.id);
});

callerFunctions.set(WWAProviderCall.getUnreadChats, (): Chat[] => {
  return getUnreadChats().map(ChatFabric.fromWWAChat);
});

callerFunctions.set(WWAProviderCall.enableOfflineMode, (enable: Boolean) => {
  window['WebSocketWrapper'].setBlockMode(enable)
  if (enable) {
    window['WebSocketWrapper'].closeAll()
  } else {
    runAutoReconnecting(30000)
  }
});

callerFunctions.set(WWAProviderCall.isOfflineModeEnabled, (): Boolean => {
  return window['WebSocketWrapper'].isBlocked()
});


provideModules();



const extBridgePort = browser.runtime.connect('%%EXTENSION_GLOBAL_ID%%', { name: BridgePortType.WWA_EXTERNAL_CONNECTOR });

extBridgePort.onMessage.addListener((request: WWAProviderRequest) => {
  handleRequest(request);
});

// Move to EventBus
ChatModule.Msg.on('add', async (msg:any) => {
  const user = ConnModule.wid;
  if (!msg.isNewMsg) return;
  if (msg.id.fromMe) return;
  extBridgePort.postMessage({action: "NEW_MESSAGE", payload: {msg, user}});
})

// Move to EventBus
ChatModule.Msg.on('add', async (msg:any) => {
  const user = ConnModule.wid;
  extBridgePort.postMessage({action: "LOG", payload: {type: "INFO", message: "New message", payload: {msg, user}}});
})

extBridgePort.onDisconnect.addListener(handlePortDisconnection);

async function handleRequest(request: WWAProviderRequest) {
  let result;
  let error;
  try {
    if (callerFunctions.has(request.call)) {
      const callerFunc = callerFunctions.get(request.call);
      if (request.args) {
        result = await callerFunc(...request.args);
      } else {
        result = await callerFunc();
      }
    } else {
      throw new Error(`Caller ${request.call} not defined`);
    }
  } catch (e) {
    console.error(e, "request=", request);
    error = e;
  }
  extBridgePort.postMessage(generateBasicWWAResponse(request.id, result, error, request));
}

function handlePortDisconnection(port: any) {
  setChatsGlobalSoundsState(true);
}

/*
EventBus.ts
*/

const eventPort = browser.runtime.connect('%%EXTENSION_GLOBAL_ID%%', {
  name: BridgePortType.WWA_EVENTS_CONNECTOR
});

function publishEvent(event: InternalEvent, args: any[]) {
  eventPort.postMessage({
    name: event,
    data: args
  } as InternalBusEvent)
}

ChatModule.Chat.on('change:pin', (message: any) => {
});

ChatModule.Chat.on('change:unreadCount', (chat: any) => {
  publishEvent(InternalEvent.CHAT_CHANGED_UNREAD_COUNT, [ChatFabric.fromWWAChat(chat)]);
});

ChatModule.Msg.on('add', (message: any) => {
  publishEvent(InternalEvent.CHAT_NEW_MESSAGE, [message]);
});
