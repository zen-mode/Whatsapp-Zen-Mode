import browser from "webextension-polyfill";
import {BridgePortType, WWAProviderCall, WWAProviderResponse} from "./types";
import {generateBasicWWARequest} from "./Utils";
import {Chat} from "./model/Chat";
import { getHiddenChatById, removeHiddenChats } from "./Storage";

// TODO from callback hell to Promise hell :)
type PromiseProto = {
  resolve: (value: WWAProviderResponse) => unknown;
  reject: (value: WWAProviderResponse) => unknown;
};

const requestIdToPromiseProto = {};
const pageBridgePort = browser.runtime.connect('%%EXTENSION_GLOBAL_ID%%', { name: BridgePortType.WWA_EXTENSION_CONNECTOR });

pageBridgePort.onMessage.addListener(async (response: any) => { // TODO: fix typing
  
  if (response.action === "NEW_MESSAGE") {
    return await processChatMessage(response);
  }

  const requestId = response.id;
  if (requestId) {
    const callback = requestIdToPromiseProto[requestId];
    if (callback) {
      if (response.result) {
        callback(response.result);
      } else {
        callback();
      }
    }
    delete requestIdToPromiseProto[response.id]
  }
});

async function processChatMessage(response: any) {
  const { msg, user } = response.payload;
  const userId = user.toString();
  const chatId = msg.fromMe ? msg.to : msg.from;
  const chat = await getHiddenChatById(chatId)
  const isHidden = !!chat;
  
  if (chat?.isGroup) {
    const isMentioned = msg.mentionedJidList.find((mentionedJid: string) => mentionedJid === userId);
    const isQuoted = msg.quotedParticipant === userId;
    if (isMentioned || isQuoted) {
      removeHiddenChats(chat);
      return;
    }
  }

  return;
}

function callProviderFunctionWithCallback(call: WWAProviderCall, args: any[], callback?: (result: any) => void) {
  const request = generateBasicWWARequest(call, args);
  requestIdToPromiseProto[request.id] = callback;
  pageBridgePort.postMessage(request);
}

export function findChatByTitle(chatTitle: string, callback?: (chat: Chat | null) => void): void {
  callProviderFunctionWithCallback(WWAProviderCall.findChatByTitle, [chatTitle], callback);
}

export function updateChatModels(chats: Chat[], callback?: (chats: Chat[]) => void) {
  callProviderFunctionWithCallback(WWAProviderCall.updateChatModels, [chats], callback);
}

export function muteChatLocally(chat: Chat, callback?: () => void) {
  callProviderFunctionWithCallback(WWAProviderCall.muteChatLocally, [chat], callback);
}

export function unmuteChatsLocally(chats: Chat[], callback?: () => void) {
  callProviderFunctionWithCallback(WWAProviderCall.unmuteChatsLocally, [chats], callback);
}

export function muteNonMutedChatsExceptChat(chat: Chat, callback?: (mutedChats: Chat[]) => void) {
  callProviderFunctionWithCallback(WWAProviderCall.muteNonMutedChatsExceptChat, [chat], callback);
}

export function archiveChatLocally(chat: Chat, callback?: () => void) {
  callProviderFunctionWithCallback(WWAProviderCall.archiveChatLocally, [chat], callback);
}

export function unArchiveChatLocally(chat: Chat, callback?: () => void) {
  callProviderFunctionWithCallback(WWAProviderCall.unArchiveChatLocally, [chat], callback);
}

export function getChatById(chatId: string, callback?: (chat: Chat) => void): void {
  callProviderFunctionWithCallback(WWAProviderCall.getChatById, [chatId], callback);
}

export function openChat(chat: Chat, callback?: (openedChat: Chat) => void) {
  callProviderFunctionWithCallback(WWAProviderCall.openChat, [chat], callback);
}

export function getOpenedChat(callback: (chat: Chat | null) => void) {
  callProviderFunctionWithCallback(WWAProviderCall.getOpenedChat, [], callback);
}

export function refreshWWChats(callback?: () => void) {
  callProviderFunctionWithCallback(WWAProviderCall.refreshWWChats, [], callback);
}

export function turnOnChatsSounds(callback?: () => void) {
  callProviderFunctionWithCallback(WWAProviderCall.setChatsSounds, [true], callback);
}

export function turnOffChatsSounds(callback?: () => void) {
  callProviderFunctionWithCallback(WWAProviderCall.setChatsSounds, [false], callback);
}

export function getChatsSoundsState(callback: (state: boolean) => void) {
  callProviderFunctionWithCallback(WWAProviderCall.getChatsSoundsState, [], callback);
}

export function markChatAsRead(chatId: string) {
  callProviderFunctionWithCallback(WWAProviderCall.markChatAsRead, [chatId]);
}

export function getProfilePicUrl(chat: Chat, callback: (picUrl: string | null) => void) {
  callProviderFunctionWithCallback(WWAProviderCall.getProfilePicUrl, [chat], callback);
}

export function getUnreadChats(callback: (chats: Chat[]) => void) {
  callProviderFunctionWithCallback(WWAProviderCall.getUnreadChats, [], callback);
}
