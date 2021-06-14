// import {browser} from "webextension-polyfill-ts";
// see https://github.com/mozilla/webextension-polyfill/issues/316
import {BridgePortType, WWAProviderCall, WWAProviderRequest} from "./types";
import {generateBasicWWAResponse} from "./Utils";
import {
  getChat,
  getChatByTitle,
  openChat, synchronizeWWChats, getChatsExceptId, muteChatLocally
} from "./WWAController";
import {provideModules} from "./WWAProvider";
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

callerFunctions.set(WWAProviderCall.findChatByTitle, (chatTitle: string) => {
  const chat = getChatByTitle(chatTitle);
  return ChatFabric.fromWWAChat(chat);
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
  const WWAChatsForMute = getChatsExceptId(chat.id);
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

callerFunctions.set(WWAProviderCall.openChat, (chat: Chat): void => {
  openChat(chat.id);
});

callerFunctions.set(WWAProviderCall.refreshWWChats, async () => {
  await synchronizeWWChats();
});


provideModules();



const extBridgePort = browser.runtime.connect('%%EXTENSION_GLOBAL_ID%%', { name: BridgePortType.WWA_EXTERNAL_CONNECTOR });

extBridgePort.onMessage.addListener((request: WWAProviderRequest) => {
  handleRequest(request);
});

async function handleRequest(request: WWAProviderRequest) {
  console.log("handleRequest", request);
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
