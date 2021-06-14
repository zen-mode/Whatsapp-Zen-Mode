export enum BridgePortType {
  WWA_EXTENSION_CONNECTOR = '0LLQsNGC0YbQsNC/',
  WWA_EXTERNAL_CONNECTOR = '0YHQvtGB0Lg='
}

export enum WWAProviderCall {
  findChatByTitle,
  updateChatModels,
  muteChatLocally,
  unmuteChatsLocally,
  archiveChatLocallyByTitle,
  muteNonMutedChatsExceptChat,
  unarchiveChatLocallyByTitle,
  muteAndArchiveChatLocally,
  getChatById,
  openChat,
  refreshWWChats
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
