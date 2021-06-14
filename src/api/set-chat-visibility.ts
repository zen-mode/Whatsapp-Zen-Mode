import {muteAndArchiveChatLocally, unmuteAndUnarchiveChatLocally} from "../whatsapp/ExtensionConnector";
import {Chat} from "../whatsapp/model/Chat";
import {subscribeForeverHiddenChatChanges} from "../whatsapp/Storage";

export function setChatVisibility(
  chat: Chat,
  isVisible: boolean,
): void {
  if (isVisible) {
    unmuteAndUnarchiveChatLocally(chat);
  } else {
    muteAndArchiveChatLocally(chat);
  }
}

subscribeForeverHiddenChatChanges((hiddenChats, oldHiddenChats) => {
  const hiddenChatIds = hiddenChats.map(c=>c.id);
  hiddenChats.forEach(hiddenChat => setChatVisibility(hiddenChat, false));
  oldHiddenChats.forEach(hiddenChat => {
    if (!hiddenChatIds.includes(hiddenChat.id))
      setChatVisibility(hiddenChat, true);
  });
})
