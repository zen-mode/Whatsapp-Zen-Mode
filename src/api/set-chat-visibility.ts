import {
  archiveChatLocally,
  markChatAsRead,
  muteChatLocally,
  unArchiveChatLocally,
  unmuteChatsLocally
} from "../whatsapp/ExtensionConnector";
import {Chat} from "../whatsapp/model/Chat";
import {subscribeForeverHiddenChatChanges} from "../whatsapp/Storage";
import {getSmartMuteStatus} from "../features/user-can/SmartMute/SmartMute";

export function setChatVisibility(
  chat: Chat,
  isVisible: boolean,
  smartMuteStatus?: boolean,
): void {
  if (isVisible) {
    if (!smartMuteStatus) {
      unmuteChatsLocally([chat]);
    }
    unArchiveChatLocally(chat);
  } else {
    if (!smartMuteStatus) {
      muteChatLocally(chat);
    }
    archiveChatLocally(chat);
  }
}

subscribeForeverHiddenChatChanges(async (hiddenChats, oldHiddenChats) => {
  const smartMuteStatus = await getSmartMuteStatus();
  const hiddenChatIds = hiddenChats.map(c => c.id);
  hiddenChats.forEach(hiddenChat => setChatVisibility(hiddenChat, false, smartMuteStatus));
  oldHiddenChats.forEach(hiddenChat => {
    if (!hiddenChatIds.includes(hiddenChat.id))
      setChatVisibility(hiddenChat, true, smartMuteStatus);
  });
})
