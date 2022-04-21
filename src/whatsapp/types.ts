export enum BridgePortType {
  WWA_EXTENSION_CONNECTOR = '0LLQsNGC0YbQsNC/',
  /**
 * @deprecated Use new bridge types
 */
  WWA_EXTERNAL_CONNECTOR = '0YHQvtGB0Lg=',
  PAGE_CONTEXT_CONNECTOR = 'n0YHQvtGB0Lg=',
  WWA_EVENTS_CONNECTOR = '0KXRg9CZ'
}

export enum InternalEvent {
  CHAT_CHANGED_UNREAD_COUNT = 'CHAT_CHANGED_UNREAD_COUNT',
  CHAT_NEW_MESSAGE = 'CHAT_NEW_MESSAGE'
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
}

/**
 * @deprecated Use new bridge types
 */
export type WWAProviderRequest = {
  id: string;
  call: WWAProviderCall;
  args: any[];
};

/**
 * @deprecated Use new bridge types
 */
export type WWAProviderResponse = {
  id: string;
  result?: any;
  error?: any;
  original?: WWAProviderRequest;
};

export type BridgeRequest = {
  id: string;
  call: string;
  args: any[];
};

export type BridgeResponse = {
  id: string;
  result?: any;
  error?: any;
  original?: BridgeRequest;
};

export type InternalBusEvent = {
  name: InternalEvent,
  data?: any[]
}
