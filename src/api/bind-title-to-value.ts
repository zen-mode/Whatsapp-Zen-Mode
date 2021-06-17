import {Chat} from "../whatsapp/model/Chat";
import {updateChatModels} from "../whatsapp/ExtensionConnector";
import {devprint} from "../../utility-belt/helpers/debug/devprint";
import {DOM} from "../../utility-belt/helpers/dom/DOM-shortcuts";
import {set_el_attributes} from "../../utility-belt/helpers/dom/set-el-attributes";

const EMPTY_FAVICON_SRC = "/img/favicon_c5088e888c97ad440a61d247596f88e5.png";

let originalTitleValue: string | null;
let originalFavIconSrc: string | null;

const titleObserver = new MutationObserver(mutations => {
  if (bindedChats && bindedChats.length > 0) {
    const mutation = mutations[0];
    devprint('mutation', mutation);
    if (mutation) {
      if (!originalTitleValue) {
        const oldTitleNode = mutation.removedNodes[0];
        if (oldTitleNode)
          originalTitleValue = oldTitleNode.textContent;
        setTimeout(() => {
          const favIconEl = DOM.get_el('#favicon', document.head);
          devprint('favIconEl', favIconEl);
          if (favIconEl)
            originalFavIconSrc = favIconEl.getAttribute('src');
        }, 300);
      }
      onTitleChanged();
    }
  }
});

function getTitleByUnreadSum(unreadSum: number): string {
  if (unreadSum > 0) {
    return `(${unreadSum}) WhatsApp`;
  } else {
    return 'WhatsApp';
  }
}

let bindedChats: Chat[] = [];

function onTitleChanged() {
  updateChatModels(bindedChats, (updatedChats: Chat[]) => {
    let unreadSum = 0;
    updatedChats.forEach(c => {
      unreadSum += c.unreadCount;
    });
    const newTitle = getTitleByUnreadSum(unreadSum);
    if (document.title != newTitle)
      document.title = newTitle;
      setFavicon(EMPTY_FAVICON_SRC);
  });
}

titleObserver.observe(
  document.getElementsByTagName('title')[0]!!, {
    subtree: true,
    characterData: true,
    childList: true
  }
);

export function bindChatsToTitleUnread(...chats: Chat[]) {
  chats.forEach((chat, i) => {
    const findedChat = bindedChats.find(c => c && c.id === chat.id);
    if (findedChat)
      delete chats[i];
  })
  bindedChats.push(...chats);
  onTitleChanged();
}

// export function unbindChatsToTitleUnread(...chats: Chat[]) {
//   bindedChats.forEach((chat, i) => {
//     const findedChat = chats.find(c => c && c.id === chat.id);
//     if (findedChat)
//       delete bindedChats[i];
//   });
//   onTitleChanged(document.title);
// }

export function unbindAllChatsToTitle() {
  bindedChats = [];
  resetTitleAndIcon();
}

function setFavicon(src: string) {
  if (src) {
    const favIconEl = DOM.get_el('#favicon', document.head);
    if (favIconEl)
      set_el_attributes(favIconEl, {
        src: src,
        href: src
      });
  }
}

function resetTitleAndIcon() {
  if (originalTitleValue)
    document.title = originalTitleValue;
  if (originalFavIconSrc)
    setFavicon(originalFavIconSrc)
  originalTitleValue = null;
  originalFavIconSrc = null;
}
