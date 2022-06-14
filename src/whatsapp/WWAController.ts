import {WapModule, ChatModule, CmdModule, MUTE_FOREVER, SocketModule} from "./WWAProvider";

export function getWWVersion() {
  // @ts-ignore
  return window.Debug.VERSION
}

export function getChats(): any[] {
  return ChatModule.Chat._models;
}

export function getPinnedChats(): any[] {
  return ChatModule.Chat.filter((c: any) => c.pin);
}

export function getChatsExceptId(chatId: string): any[] {
  return getChats()
    .filter(chat => !chat.mute.isMute && chat.id.toString() !== chatId);
}

export function getChat(chatId: string): any {
  return ChatModule.Chat.get(chatId);
}

export function getChatByWID(wid: any): any {
  return ChatModule.Chat.get(wid);
}

export function getChatByTitle(chatTitle: string): any {
  return ChatModule.Chat._models.find((chat: any) => {
    return chat.title() === chatTitle;
  })
}

export function getOpenedChat(): any {
  return ChatModule.Chat.getActive();
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

export function openChat(chatId: string): any {
  const chat = ChatModule.Chat.get(chatId);
  CmdModule.openChatAt(chat);
  return chat;
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

export function markChatAsRead(chatId: string): any {
  const chat = ChatModule.Chat.get(chatId);
  const styleEl = document.createElement('style');
  document.head.appendChild(styleEl);
  const styleSheet = styleEl.sheet;
  if (!styleSheet) {
    throw new Error("No stylesheet")
  }
  styleSheet?.insertRule("._21opK { display: none }", 0);
  CmdModule.markChatUnread(chat, 0);
  window.setTimeout(() => styleEl.remove(), 10000);
}

export function markChatUnread(chatId: string): any {
  const chat = ChatModule.Chat.get(chatId);
  CmdModule.markChatUnread(chat, 1);
}

export async function getProfilePicUrl(chatId: string): Promise<string | undefined> {
  const result = await WapModule.profilePicFind(chatId);
  return result.eurl || null;
}

export function getUnreadChats(): any[] {
  return ChatModule.Chat._models.filter((c: any) => c.hasUnread);
}

function setRetryTime(time: number) {
  SocketModule.retryTimestamp = time
}

function appIsOnline(): boolean {
  return SocketModule.state === 'CONNECTED'
}

function appIsRetryConnecting() {
  return SocketModule.retryTimestamp != null
}

export function runAutoReconnecting(timeout: number) {
  if (appIsRetryConnecting()) {
    setRetryTime(0)
  } else {
    let rate = 0
    const stepRate = 100
    const maxRate = timeout
    const interval = setInterval(() => {
      if (appIsOnline() || rate >= maxRate) {
        clearInterval(interval)
        return;
      } else if (appIsRetryConnecting()) {
        setRetryTime(0)
      }
      rate += stepRate
    }, stepRate)
  }
}


