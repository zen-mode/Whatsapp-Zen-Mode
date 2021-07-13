import {browser} from "webextension-polyfill-ts";
import {BridgePortType, WWAProviderCall, WWAProviderResponse} from "./types";
import {generateBasicWWARequest} from "./Utils";
import {Chat} from "./model/Chat";

// TODO from callback hell to Promise hell :)
type PromiseProto = {
  resolve: (value: WWAProviderResponse) => unknown;
  reject: (value: WWAProviderResponse) => unknown;
};

const requestIdToPromiseProto = {};
const pageBridgePort = browser.runtime.connect('%%EXTENSION_GLOBAL_ID%%', { name: BridgePortType.WWA_EXTENSION_CONNECTOR });

pageBridgePort.onMessage.addListener((response: WWAProviderResponse) => {
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
    delete requestIdToPromiseProto[response.id];
  }
});

function callProviderFunctionWithCallback(
  call: WWAProviderCall,
  args: any[],
  callback?: (result: any) => void,
) {
    const request = generateBasicWWARequest(call, args);
    requestIdToPromiseProto[request.id] = callback;
    console.log("callProviderFunctionWithCallback", request)
    pageBridgePort.postMessage(request);
}

export function findChatByTitle(
  chatTitle: string,
  callback?: (chat: Chat | null) => void,
): void {
  callProviderFunctionWithCallback(
    WWAProviderCall.findChatByTitle,
    [chatTitle],
    callback,
  );
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

export function muteNonMutedChatsExceptChats(
  callback?: (mutedChats: Chat[]) => void,
  ...chats: Chat[]
) {
  callProviderFunctionWithCallback(
    WWAProviderCall.muteNonMutedChatsExceptChat,
    [chats],
    callback,
  );
}

export function archiveChatLocally(chat: Chat, callback?: () => void) {
  callProviderFunctionWithCallback(WWAProviderCall.archiveChatLocally, [chat], callback);
}

export function unArchiveChatLocally(chat: Chat, callback?: () => void) {
  callProviderFunctionWithCallback(
    WWAProviderCall.unArchiveChatLocally,
    [chat],
    callback,
  );
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
