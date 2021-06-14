import {ChatModule, CmdModule, MUTE_FOREVER} from "./WWAProvider";
import {retentionArchiveChatLocally, retentionUnarchiveChatLocally} from "./RetentionArchiveChat";

function getChats(): any[] {
  return ChatModule.Chat.models;
}

export function getChat(chatId: string): any {
  return ChatModule.Chat.get(chatId);
}

export function getChatByTitle(chatTitle: string): any {
  return ChatModule.Chat.models.find((chat: any) => {
    return chat.title() === chatTitle;
  })
}

export function muteChatLocally(chatId: string) {
  const chat = ChatModule.Chat.get(chatId);
  if (chat.mute.isMute != true)
    chat.mute.setMute(MUTE_FOREVER, false);
}

export function unmuteChatLocally(chatId: string) {
  const chat = ChatModule.Chat.get(chatId);
  if (chat.mute.isMute != false)
    chat.mute.setMute(0, false);
}

export function archiveChatLocally(chatId: string) {
  const chat = ChatModule.Chat.get(chatId);
  retentionArchiveChatLocally(chat);
}

export function unarchiveChatLocally(chatId: string) {
  retentionUnarchiveChatLocally(chatId);
}

export function openChat(chatId: string) {
  const chat = ChatModule.Chat.get(chatId);
  CmdModule.openChatAt(chat);
}

export async function synchronizeWWChats() {
  await ChatModule.Chat.sync();
}

export function muteNonMutedChatsExceptId(chatId: string): any[] {
  const chatsForMute = getChats()
    .filter(chat => !chat.mute.isMute && chat.id !== chatId);
  // Mute non muted chats
  chatsForMute.forEach(chat => muteChatLocally(chat.id));

  return chatsForMute;

}
