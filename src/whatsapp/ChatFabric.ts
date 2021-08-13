import {Chat} from "./model/Chat";

export class ChatFabric {
  static fromWWAChat(wwaChat: any): Chat {
    return {
      id: wwaChat.id,
      isGroup: wwaChat.isGroup,
      name: wwaChat.name,
      title: wwaChat.title(),
      hasUnread: wwaChat.hasUnread,
      unreadCount: wwaChat.unreadCount,
      previewMessage: wwaChat.previewMessage && wwaChat.previewMessage.text ? wwaChat.previewMessage.text : null
    }
  }
}
