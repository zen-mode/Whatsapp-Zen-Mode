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
import { getAutoReadHiddenConversationsStatus } from "../features/user-can/auto-read-hidden-conversations/AutoReadHiddenConversations";
import { AutoReadHiddeConversationStatuses } from "../data/dictionary";

export function setChatVisibility(
  chat: Chat,
  isVisible: boolean,
  smartMuteStatus?: boolean,
  autoReadHiddenConversationsStatus?: AutoReadHiddeConversationStatuses
): void {
  if (isVisible) {
    if (!smartMuteStatus) {
      unmuteChatsLocally([chat]);
    }
    if (autoReadHiddenConversationsStatus === AutoReadHiddeConversationStatuses.ENABLED) {
      markChatAsRead(chat.id);
    }
    unArchiveChatLocally(chat);
  } else {
    if (!smartMuteStatus) {
      muteChatLocally(chat);
    }
    archiveChatLocally(chat);
    markChatAsRead(chat.id);
  }
}

subscribeForeverHiddenChatChanges(async (hiddenChats, oldHiddenChats) => {
  const smartMuteStatus = await getSmartMuteStatus();
  const autoReadHiddenConversationsStatus = await getAutoReadHiddenConversationsStatus()
  const hiddenChatIds = hiddenChats.map(c => c.id);
  hiddenChats.forEach(hiddenChat => setChatVisibility(hiddenChat, false, smartMuteStatus, autoReadHiddenConversationsStatus));
  oldHiddenChats.forEach(hiddenChat => {
    if (!hiddenChatIds.includes(hiddenChat.id))
      setChatVisibility(hiddenChat, true, smartMuteStatus, autoReadHiddenConversationsStatus);
  });
})
