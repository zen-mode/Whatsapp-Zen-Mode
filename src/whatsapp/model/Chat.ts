export interface BaseChat {
  id: string;
  name: string;
  title: string;
  isGroup: boolean;
  hasUnread: boolean;
  unreadCount: number;
  previewMessage?: string;
  archive: boolean;
  pinned: boolean;
}

export type Chat = BaseChat;
