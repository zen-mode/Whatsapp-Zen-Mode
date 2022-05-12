import {Chat} from "../../model/Chat";
import {devprint} from "../../../../utility-belt/helpers/debug/devprint";
import {constructBaseLeftDrawerItemList, LeftDrawerItemList} from "./LeftDrawerItemList";
import {subscribeForeverHiddenChatChanges, removeHiddenChats} from "../../Storage";
import browser from "webextension-polyfill";
import {DrawerChatCtxMenu} from "../FakeCtxMenu/DrawerChatCtxMenu";
import { openChat } from "../../ExtensionConnector";
import { constructChatItem } from "./ChatItem";

let hiddenChatsDrawer: LeftDrawerItemList<Chat>;
const hiddenChatCtxMenu = new DrawerChatCtxMenu([
  {
    action: 'unhide',
    domNode: browser.i18n.getMessage('WA_contactCtxMenuItem_unhide'),
    chatChange: removeHiddenChats
  }
]);

export function presentHiddenChatsLeftDrawer(hiddenChats: Chat[]): LeftDrawerItemList<Chat> {
  if (hiddenChatsDrawer) {
    hiddenChatsDrawer.close();
  }
  hiddenChatsDrawer = constructBaseLeftDrawerItemList<Chat>(
    browser.i18n.getMessage('ZM_hiddenChats'),
    hiddenChats,
    () => {},
    (chat: Chat) => {
      return constructChatItem(
        chat,
        () => {
          openChat(chat);
        },
        (e: any) => {
          e.stopPropagation();
          e.preventDefault();
          if (hiddenChatCtxMenu.chat?.id === chat.id) {
            hiddenChatCtxMenu.detachChat(chat);
          } else {
            hiddenChatCtxMenu.attachToChat(chat, e.target.getBoundingClientRect());
          }
        },
      ).htmlElement
    },
    () => {},
    browser.i18n.getMessage('ZM_noHiddenChats')
  );
  hiddenChatsDrawer.open();
  return hiddenChatsDrawer;
}

subscribeForeverHiddenChatChanges((hiddenChats) => {
  if (hiddenChatsDrawer)
    hiddenChatsDrawer.set(hiddenChats);
})
