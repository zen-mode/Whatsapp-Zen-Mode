import {ChatModule, CmdModule, MUTE_FOREVER} from "./WWAProvider";

function getChats(): any[] {
  return ChatModule.Chat.models;
}

export function getChatsExceptId(chatId: string): any[] {
  return getChats()
    .filter(chat => !chat.mute.isMute && chat.id !== chatId);
}

export function getChat(chatId: string): any {
  return ChatModule.Chat.get(chatId);
}

export function getChatByTitle(chatTitle: string): any {
  return ChatModule.Chat.models.find((chat: any) => {
    return chat.title() === chatTitle;
  })
}

export function muteChatLocally(chat: any) {
  if (chat.mute.isMuted != true)
    chat.mute.setMute(MUTE_FOREVER, false);
}

export function unmuteChatLocally(chat: any) {
  if (chat.mute.isMuted != false)
    chat.mute.setMute(0, false);
}

export function archiveChatLocally(chat: any) {
  if (chat.archive != true)
    chat.archive = true;
}

export function unarchiveChatLocally(chat: any) {
  if (chat.archive != false)
    chat.archive = false;
}

export function openChat(chatId: string) {
  const chat = ChatModule.Chat.get(chatId);
  CmdModule.openChatAt(chat);
}

export async function synchronizeWWChats() {
  await ChatModule.Chat.sync();
}

export function getChatsGlobalSoundsState(): boolean {
  return Boolean(ChatModule.Mute.getGlobalSounds());
}

export function setChatsGlobalSoundsState(state: boolean) {
  ChatModule.Mute.setGlobalSounds(state);
}
