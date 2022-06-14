export enum BridgePortType {
  WWA_EXTENSION_CONNECTOR = '0LLQsNGC0YbQsNC/',
  WWA_EXTERNAL_CONNECTOR = '0YHQvtGB0Lg=',
  WWA_EVENTS_CONNECTOR = '0KXRg9CZ'
}

export enum InternalEvent {
  CHAT_CHANGED_UNREAD_COUNT = 'CHAT_CHANGED_UNREAD_COUNT',
  CHAT_NEW_MESSAGE = 'CHAT_NEW_MESSAGE',
  CHAT_CHANGED_PIN = 'CHAT_CHANGED_PIN',
  CHAT_CHANGED_STATUS = 'CHAT_CHANGED_STATUS'
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
  markChatAsRead,
  markChatUnread,
  getProfilePicUrl,
  getUnreadChats,
  enableOfflineMode,
  isOfflineModeEnabled,
  getPinnedChats
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


export type InternalBusEvent = {
  name: InternalEvent,
  data?: any[]
}
