export interface BaseChat {
  id: string;
  name: string;
  title: string;
  isGroup: boolean;
  hasUnread: boolean;
  unreadCount: number;
}

export type Chat = BaseChat;
