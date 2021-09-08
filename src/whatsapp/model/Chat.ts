export interface BaseChat {
  id: string;
  name: string;
  title: string;
  isGroup: boolean;
  hasUnread: boolean;
  unreadCount: number;
  previewMessage?: string;
}

export type Chat = BaseChat;
