import {process_error} from "../../extension-can/process-errors/process-error";
import {lastHoveredChat} from "../../extension-can/display-zen-mode-ui/construct-zen-mode-ui/attach_hide_contact_item";
import browser from "webextension-polyfill";
import {Selectors} from "../../../data/dictionary";
import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {get_contact_el_by_chat_name} from "../../../api/get-contact-el-by-contact-name";
import { Chat } from "../../../whatsapp/model/Chat";
import { getChatById, refreshWWChats } from "../../../whatsapp/ExtensionConnector";
import {set_el_style} from "../../../../utility-belt/helpers/dom/set-el-style";
import {removeChat, appendChat} from "../../../whatsapp/InchatPinsStatus";
import { subscribeForeverPinnedChatsStatusChanges, addMiniPreviewChats, removeMiniPreviewChats, countMiniPreviewChats, getMiniPreviewChats, getPinnedChatsStatus, clearMiniPreviewChats } from "../../../whatsapp/Storage";

subscribeForeverPinnedChatsStatusChanges(async (enabled: boolean) => {
  if (!enabled) {
    const storageChats = await getMiniPreviewChats();
    clearMiniPreviewChats();
    for (const [i, chat] of storageChats.entries()) {
      removeMiniPreviewIcon(chat);
      removeChat(chat);
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
    }
  } else {
    removeMiniPreviewChats(lastHoveredChat);
    removeMiniPreviewIcon(lastHoveredChat);
    removeChat(lastHoveredChat);
  }
}

export function addMiniPreviewIcon(chat: Chat) {
  const chatEl = get_contact_el_by_chat_name(chat.title);
  if (!chatEl) return;  
  const parent = chatEl.parentElement;
  if (!parent) return;
  const div = parent.querySelector(Selectors.WA_CONTACT_ICONS);
  if (!div) return;
  div.className += " withPreview";
}

export function removeMiniPreviewIcon(chat: Chat) {
  const chatEl = get_contact_el_by_chat_name(chat.title);
  if (!chatEl) return;  
  const parent = chatEl.parentElement;
  if (!parent) return;
  const div = parent.querySelector(Selectors.WA_CONTACT_ICONS);
  if (!div) return;
  div.classList.remove("withPreview");
}

export async function fetchMiniPreviewChats() {
  const storageChats = await getMiniPreviewChats();
  //console.log(storageChats);
  for (const [i, chat] of storageChats.entries()) {
    //console.log(i, chat);
    storageChats[i] = await new Promise(resolve => getChatById(storageChats[i]!.id, resolve));
  }
  return storageChats;
}