import {hide_WA_context_menu} from "../../../api/hide-wa-context-menu";
import {addHiddenChats, removeHiddenChats} from "../../../whatsapp/Storage";
import {process_error} from "../../extension-can/process-errors/process-error";
import {lastHoveredChat} from "../../extension-can/display-zen-mode-ui/construct-zen-mode-ui/attach_hide_contact_item";
import browser from "webextension-polyfill";
import {Selectors} from "../../../data/dictionary";

export function hide_contact(chosenDelay?: number, chatInBatchMode?: boolean): void {
  set_hide_contact(true, chosenDelay, chatInBatchMode);
  // lastHoveredChat = null;
}

export function unhide_contact(): void {
  hide_WA_context_menu();
  set_hide_contact(false);
  // lastHoveredChat = null;
}

function set_hide_contact(hide: boolean, chosenDelay?: number, chatInBatchMode?: boolean): void {
  /*if (chatInBatchMode) {
    console.log("Chat in Batch Mode!");
    // All html chats
    let dialogItems = document.querySelectorAll('div.lhggkp7q.ln8gz9je.rx9719la');
    let chatInBatchMode = [lastHoveredChat];
    console.log(lastHoveredChat);
    let dialogItemChatsInBatchMode = [];

    dialogItems.forEach(htmlChat => {
      const itemName = item.querySelector('.zoWT4').querySelector('span').textContent;
      console.log(htmlChat);
      console.log(itemName);
      if (itemName == lastHoveredChat.name) {
        dialogItemChatsInBatchMode.push(htmlChat);
        console.log(htmlChat);
      }

      if (itemName == lastHoveredChat.title) {
        dialogItemChatsInBatchMode.push(htmlChat);
        console.log(htmlChat);
      }
    });




    console.log(dialogItemChatsInBatchMode);
  }*/

  if (!lastHoveredChat) {
    process_error("Hover chat not define")
    return;
  }
  if (hide) {
    if (chosenDelay) {
      browser.runtime.sendMessage({type: 'setAlarm', payload: {
        chat: lastHoveredChat,
        delay: chosenDelay
      }})
    }
    addHiddenChats(lastHoveredChat);
  } else {
    removeHiddenChats(lastHoveredChat);
    browser.runtime.sendMessage({type: 'deleteShedule', payload: {chat: [lastHoveredChat.id]}});
  }
}

export function set_hide_contact_chat(hide, chosenDelay, chat){
  if (!chat) {
    process_error("Hover chat not define")
    return;
  }
  if (hide) {
    if (chosenDelay) {
      browser.runtime.sendMessage({type: 'setAlarm', payload: {
        chat: chat,
        delay: chosenDelay
      }})
    }
    addHiddenChats(chat);
  } else {
    removeHiddenChats(chat);
    browser.runtime.sendMessage({type: 'deleteShedule', payload: {chat: [chat.id]}});
  }
}

export function renderHiddenLabel(chatEl: HTMLElement) {
  const span = chatEl.querySelector(Selectors.WA_HIDDEN_LABEL_CONTAINER);
  if (!span) return;
  span.innerHTML = browser.i18n.getMessage('ZM_hidden');
}

browser.runtime.onMessage.addListener(function(message) {
  const { type, payload } = message;
  if (type === "unhideChat") {
    removeHiddenChats(payload.chat);
  }
})
