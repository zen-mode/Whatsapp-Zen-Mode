export enum BridgePortType {
  WWA_EXTENSION_CONNECTOR = '0LLQsNGC0YbQsNC/',
  WWA_EXTERNAL_CONNECTOR = '0YHQvtGB0Lg='
}

export enum WWAProviderCall {
  findChatByTitle,
  updateChatModels,
  muteChatLocally,
  unmuteChatsLocally,
  archiveChatLocally,
  unArchiveChatLocally,
  muteNonMutedChatsExceptChat,
  setChatsSounds,
  getChatsSoundsState,
  getChatById,
  getOpenedChat,
  openChat,
  refreshWWChats,
  markChatAsRead
}

export type WWAProviderRequest = {
  id: string;
  call: WWAProviderCall;
  args: any[];
};

export type WWAProviderResponse = {
  id: string;
  result?: any;
  error?: any;
  original?: WWAProviderRequest;
};
