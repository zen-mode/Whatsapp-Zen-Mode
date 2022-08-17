import {process_error} from "../../extension-can/process-errors/process-error";
import {lastHoveredChat} from "../../extension-can/display-zen-mode-ui/construct-zen-mode-ui/attach_hide_contact_item";
import browser from "webextension-polyfill";
import {Selectors} from "../../../data/dictionary";
import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {get_contact_el_by_chat_name} from "../../../api/get-contact-el-by-contact-name";
import { Chat } from "../../../whatsapp/model/Chat";
import { getChatById, refreshWWChats, findChatByTitle, getPinnedChats } from "../../../whatsapp/ExtensionConnector";
import {set_el_style} from "../../../../utility-belt/helpers/dom/set-el-style";
import {removeChat, appendChat} from "../../../whatsapp/InchatPinsStatus";
import { subscribeForeverPinnedChatsStatusChanges, addMiniPreviewChats, removeMiniPreviewChats, countMiniPreviewChats, getMiniPreviewChats, getPinnedChatsStatus, clearMiniPreviewChats } from "../../../whatsapp/Storage";
import { getChatByTitle } from "../../../whatsapp/WWAController";

subscribeForeverPinnedChatsStatusChanges(async (enabled: boolean) => {
  if (!enabled) {
    const storageChats = await getMiniPreviewChats();

    if (storageChats.length != 0) {
      localStorage.setItem ("oldMiniPreviewChats", JSON.stringify(storageChats);
    }

    /*clearMiniPreviewChats();*/
    for (const [i, chat] of storageChats.entries()) {
      removeMiniPreviewIcon(chat);
      removeChat(chat);
    }
  }else{

    const oldStorageChats = JSON.parse(localStorage.getItem ("oldMiniPreviewChats"));

    if (JSON.parse(localStorage.getItem ("oldMiniPreviewChats")) != null) {
        if (JSON.parse(localStorage.getItem ("oldMiniPreviewChats")).length != 0) {
          oldStorageChats.forEach(chat => {
            addMiniPreviewChats(chat);
            addMiniPreviewIcon(chat);
            appendChat(chat);
          });

          localStorage.removeItem('oldMiniPreviewChats');
        }
    }
  }
});

export function setMiniPreview(): void {
  set_mini_preview_chat(true);
  // lastHoveredChat = null;
}

export function unsetMiniPreview(): void {
  set_mini_preview_chat(false);
  // lastHoveredChat = null;
}

async function set_mini_preview_chat(add: boolean) {
  if (!lastHoveredChat) {
    process_error("Hover chat not define")
    return;
  }

  if (add) {
    const miniPreviewChatsLength = await countMiniPreviewChats();
    if (miniPreviewChatsLength < 10) {
      addMiniPreviewChats(lastHoveredChat);
      addMiniPreviewIcon(lastHoveredChat);
      appendChat(lastHoveredChat);
    } else {
      console.log("VERY BAD");
      const miniPreviewAreaEl = DOM.get_el(Selectors.ZM_MINI_PREVIEW_AREA);
      set_el_style(miniPreviewAreaEl, { display: "initial" });
      console.log(miniPreviewAreaEl);
    }
  } else {
    removeMiniPreviewChats(lastHoveredChat);
    removeMiniPreviewIcon(lastHoveredChat);
    removeChat(lastHoveredChat);
  }
}


export async function addMiniPreviewIcon(chat: Chat) {
  if (localStorage.getItem('mini-preview-chat') === 'off') {
    return;
  }

  if (Array.isArray(chat)) {
    chat.forEach(item => {
      const chatEl = get_contact_el_by_chat_name(item.title);
      const parent = chatEl.parentElement;
      const div = parent.querySelector(Selectors.WA_CONTACT_ICONS);
      div.className += " withPreview";
      addMiniPreviewChats(chat);
    });

    return;
  }

  const chatEl = get_contact_el_by_chat_name(chat.title);
  if (!chatEl) return;
  const parent = chatEl.parentElement;
  if (!parent) return;
  const div = parent.querySelector(Selectors.WA_CONTACT_ICONS);
  if (!div) return;
  div.className += " withPreview";

  if (document.querySelector('body').classList.contains('dark'))) {
    div.className += " withPreviewDark";
  }else{
    if (div.classList.contains('withPreviewDark')) {
      div.classList.remove('withPreviewDark');
    }
  }

  addChatInchatsWithMiniPreviewIcon(chatEl);
  document.getElementById('pane-side').cloneNode(true);
  document.getElementById('pane-side').removeEventListener('scroll', async function(){
    checkAndSetMiniPreviewIcons();
  });
  document.getElementById('pane-side').addEventListener('scroll', async function(){
    checkAndSetMiniPreviewIcons();
  });
}

async function checkAndSetMiniPreviewIcons() {
  const chatsInStorage = await getMiniPreviewChats();

  let htmlChats = document.getElementsByClassName('ln8gz9je');
  let chatsWithMiniPreviewIcon = [];

  chatsInStorage.forEach(chat => {
    if (chat['name'] == null) {
      chatsWithMiniPreviewIcon.push(chat['title']);
    }else{
      chatsWithMiniPreviewIcon.push(chat['name']);
    }
  });

  for (let htmlChat of htmlChats) {
    if (htmlChat.getElementsByClassName('zoWT4')[0] != null) {
      if (chatsWithMiniPreviewIcon.indexOf(htmlChat.getElementsByClassName('zoWT4')[0].textContent) != -1) {
        if (!htmlChat.getElementsByClassName('_1i_wG')[1].classList.contains('withPreview')) {
          htmlChat.getElementsByClassName('_1i_wG')[1].classList.add('withPreview')
        }
      }else{
        if (htmlChat.getElementsByClassName('_1i_wG')[1].classList.contains('withPreview')) {
          htmlChat.getElementsByClassName('_1i_wG')[1].classList.remove('withPreview')
        }
      }
    }
  }
}

export function removeMiniPreviewIcon(chat: Chat) {
  const chatEl = get_contact_el_by_chat_name(chat.title);
  if (!chatEl) return;
  const parent = chatEl.parentElement;
  if (!parent) return;
  const div = parent.querySelector(Selectors.WA_CONTACT_ICONS);
  if (!div) return;
  div.classList.remove("withPreview");

  removeChatInChatsMiniPreviewIcon(chatEl);
}

function addChatInchatsWithMiniPreviewIcon(chatEl) {
  let chatTitle = chatEl.getElementsByClassName('ggj6brxn')[0].textContent;

  if (localStorage.getItem ("chatsWithMiniPreviewIcon") == null) {
    let chatsWithMiniPreviewIcon = [];
    chatsWithMiniPreviewIcon.push(chatTitle);
    localStorage.setItem ("chatsWithMiniPreviewIcon", JSON.stringify(chatsWithMiniPreviewIcon));
  }else{
    let chatsWithMiniPreviewIcon = JSON.parse(localStorage.getItem ("chatsWithMiniPreviewIcon"));
    let thisChatAlreadySaved = false;

    chatsWithMiniPreviewIcon.forEach(chat => {
      if (chat === chatTitle) {
        thisChatAlreadySaved = true;
      }
    });

    if (!thisChatAlreadySaved) {
      chatsWithMiniPreviewIcon.push(chatTitle);
      localStorage.setItem ("chatsWithMiniPreviewIcon", JSON.stringify(chatsWithMiniPreviewIcon));
    }
  }
}

function removeChatInChatsMiniPreviewIcon(chatEl) {
  let chatTitle = chatEl.getElementsByClassName('ggj6brxn')[0].textContent;
  let chatsWithMiniPreviewIcon = JSON.parse(localStorage.getItem ("chatsWithMiniPreviewIcon"));
  let chatIndex = chatsWithMiniPreviewIcon.indexOf(chatTitle);

  if (chatIndex !== -1) {
      chatsWithMiniPreviewIcon.splice(chatIndex, 1);
  }

  localStorage.setItem ("chatsWithMiniPreviewIcon", JSON.stringify(chatsWithMiniPreviewIcon));
}

export async function fetchMiniPreviewChats() {
  const storageChats = await getMiniPreviewChats();
  //console.log(storageChats);
  for (const [i, chat] of storageChats.entries()) {
    storageChats[i] = await new Promise(resolve => getChatById(storageChats[i]!.id, resolve));
  }
  return storageChats;
}
