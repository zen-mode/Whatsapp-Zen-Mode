import {constructBaseLeftDrawerItemList, LeftDrawerItemList} from "../LeftDrawerItemList";
import {Chat} from "../../model/Chat";
import {constructChatItem} from "./ChatItem";
import {openChat, markChatUnread} from "../../ExtensionConnector";
import browser from "webextension-polyfill";
import {WWEvents} from "../../extension/EventBus";
import {InternalEvent} from "../../types";
import {DrawerChatCtxMenu} from "../FakeCtxMenu/DrawerChatCtxMenu";

function constructEmptyPlug(): HTMLElement {
  const div = document.createElement("div");
  div.className = "_3Iwj9";
  div.innerHTML = `<div class="_2t_t3">
     <span data-testid="empty-archived" data-icon="empty-archived" class="">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" width="90" height="90">
           <path fill="currentColor" d="M71.109 24.113l-4.288-5.222c-.594-.934-1.825-1.528-3.396-1.528h-36.85a5.083 5.083 0 0 0-3.693 1.528l-3.991 5.222c-.934 1.231-1.528 2.462-1.528 3.991v38.377a6.16 6.16 0 0 0 6.156 6.156h42.962a6.16 6.16 0 0 0 6.156-6.156V28.104c0-1.529-.595-2.76-1.528-3.991zM45.042 61.896L28.146 45h10.741v-6.156h12.269V45h10.741L45.042 61.896zM23.859 23.519l2.462-3.057H63.17l2.759 3.057h-42.07z"></path>
        </svg>
     </span>
  </div>`;
  return div;
}

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
    (c) =>
      constructChatItem(
        c,
        () => {
          openChat(c);
        },
        (e: any) => {
          e.stopPropagation();
          e.preventDefault();
          if (unreadChatCtxMenu.chat?.id === c.id) {
            unreadChatCtxMenu.detachChat(c);
          } else {
            unreadChatCtxMenu.attachToChat(c, e.target.getBoundingClientRect());
          }
        },
      ).htmlElement,
    () => {},
    constructEmptyPlug,
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
