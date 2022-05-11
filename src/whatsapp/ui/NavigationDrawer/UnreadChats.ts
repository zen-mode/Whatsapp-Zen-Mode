import {constructBaseLeftDrawerItemList, LeftDrawerItemList} from "./LeftDrawerItemList";
import {Chat} from "../../model/Chat";
import {constructChatItem} from "./ChatItem";
import {openChat, markChatUnread} from "../../ExtensionConnector";
import browser from "webextension-polyfill";
import {WWEvents} from "../../extension/EventBus";
import {InternalEvent} from "../../types";
import {DrawerChatCtxMenu} from "../FakeCtxMenu/DrawerChatCtxMenu";

const unreadChatCtxMenu = new DrawerChatCtxMenu([
  {
    action: "unread",
    domNode: browser.i18n.getMessage("WA_contactCtxMenuItem_mark_unread"),
    chatChange: (chat) => {
      markChatUnread(chat.id)
    },
  },
]);

export function presentUnreadChats(chats: Chat[]): LeftDrawerItemList<Chat> {
  const drawer = constructBaseLeftDrawerItemList<Chat>(
    browser.i18n.getMessage("ZM_navigation_unreadChats"),
    chats,
    () => {},
    (chat) => {
      if (!chat.archive) {
        return constructChatItem(
          chat,
          () => {
            openChat(chat);
          },
          (e: any) => {
            e.stopPropagation();
            e.preventDefault();
            if (unreadChatCtxMenu.chat?.id === chat.id) {
              unreadChatCtxMenu.detachChat(chat);
            } else {
              unreadChatCtxMenu.attachToChat(chat, e.target.getBoundingClientRect());
            }
          },
        ).htmlElement
      } else {
        return null
      }
    },
    () => {},
  );
  WWEvents.on(InternalEvent.CHAT_CHANGED_UNREAD_COUNT, (chat: Chat) => {
    const chatFromDrawerIndex = chats.findIndex((c) => c.id === chat.id);
    if (chatFromDrawerIndex!==-1) {
      chats.splice(chatFromDrawerIndex, 1, chat)
      drawer.clear();
      drawer.set(chats)
    } else {
      chats.push(chat);
      drawer.add(chat);
    }
  });
  drawer.open();
  return drawer;
}
