// Explain: Since we use process_error if an el is not found - we always have guards..
// and dont need to check for undefined.
/* eslint-disable @typescript-eslint/no-non-null-assertion */

// Description:
// 1. Sets an interval timer to attach Zen mode UI in case of:
// 1.1. It is not already attached.
// 1.2. User navbar el is present (meaning WA has loaded and User clicked into any chat).
// 2. Attaches Zen mode UI to the page.
// 2.1. Constructs the UI.
// 2.2. Sets ZM UI in accordance with current ZM state (activated\disactivated).
import {WWEvents} from "../../../whatsapp/extension/EventBus";
import {getOpenedChat} from "../../../whatsapp/ExtensionConnector";
import {InternalEvent} from "../../../whatsapp/types";
import {hide_contact} from "../../user-can/hide-contacts/hide-contact";
import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {devprint} from "../../../../utility-belt/helpers/debug/devprint";
import {construct_Zen_mode_UI} from "./construct-zen-mode-ui/construct-zen-mode-ui";
import {Selectors} from "../../../data/dictionary";
import {TIME} from "../../../../utility-belt/constants/time";
import {
  lastHoveredChat,
  setLastHoveredChat,
} from "./construct-zen-mode-ui/attach_hide_contact_item";
import browser from "webextension-polyfill";
import {subscribeForeverZenMorningChatChanges} from "../../../whatsapp/Storage";
import {
  addHiddenChats,
  removeHiddenChats,
  clearHiddenChats,
  setHiddenChats,
  getHiddenChats,
} from "../../../whatsapp/Storage";
import {
  archiveChatLocally,
  unArchiveChatLocally,
} from "../../../whatsapp/ExtensionConnector";
import {CHAT_LIST_SELECTOR} from "../../../whatsapp/dom/DOMConstants";
import {getChats} from "../../../whatsapp/WWAController";
// 1. Sets an interval timer to attach Zen mode UI in case of:
keep_Zen_mode_UI_attached();

function keep_Zen_mode_UI_attached(): void {
  setInterval(attach_Zen_mode_UI, TIME.TENTH_OF_A_SECOND);
  devprint("STATUS: Waiting for user to log in and open any chat.");
}

var addActiveHiddenChatTimeout: any;
var addHiddenChatTimeout: any;
let handleActiveChatInBatchModeCounter = 0

async function attach_Zen_mode_UI(): Promise<void> {
  // 1.1. It is not already attached.
  // Explain: If the icon is already present - exit.
  if (DOM.get_el(Selectors.ZM_TOGGLE_BUTTON)) return;

  // 1.2. User navbar el is present (meaning WA has loaded and User clicked into any chat).
  // Explain: If WA user navbar not present - means either User is not yet logged in;
  // or not not a particular chat. In both cases - exit.
  const leftHeaderButtonsEl = DOM.get_el(Selectors.WA_LEFT_HEADER_BUTTONS);
  if (!leftHeaderButtonsEl) return;

  // 2. Attaches Zen mode UI to the page.
  // 2.1. Constructs the UI.
  const [
    debugVersionInfoEl,
    ZenModeBtnEl,
    releaseNotesAreaEl,
    visibilityShedulerAreaEl,
    offlineModeInfoEl,
    miniPreviewAreaEl,
    batchModeAreaEl,
    batchModeAreaElOff,
  ] = construct_Zen_mode_UI();

  leftHeaderButtonsEl.prepend(ZenModeBtnEl);

  leftHeaderButtonsEl.prepend(offlineModeInfoEl);

  leftHeaderButtonsEl.prepend(debugVersionInfoEl);

  const permanentZM_elsAreNotYetAttached =
    DOM.get_el(Selectors.ZM_RELEASE_NOTES_AREA) === null;
  if (permanentZM_elsAreNotYetAttached) {
    document.body.appendChild(releaseNotesAreaEl);
  }

  const permanentZM_miniPreviewAreNotYetAttached =
    DOM.get_el(Selectors.ZM_MINI_PREVIEW_AREA) === null;
  if (permanentZM_miniPreviewAreNotYetAttached) {
    document.body.appendChild(miniPreviewAreaEl);
  }

  const permanentZM_visibilityShedulerAreaElNotYetAttached =
    DOM.get_el(Selectors.ZM_VISIBILITY_SHEDULER_POPUP) === null;
  if (permanentZM_visibilityShedulerAreaElNotYetAttached) {
    document.body.appendChild(visibilityShedulerAreaEl);
  }

  const permanentZM_batchModeAreaEllNotYetAttached =
    DOM.get_el(Selectors.ZM_BATCH_MODE_POPUP) === null;
  if (permanentZM_batchModeAreaEllNotYetAttached) {
    document.body.appendChild(batchModeAreaEl);
  }

  const permanentZM_batchModeAreaEllOffNotYetAttached =
    DOM.get_el(Selectors.ZM_BATCH_MODE_POPUP_OFF) === null;
  if (permanentZM_batchModeAreaEllOffNotYetAttached) {
    document.body.appendChild(batchModeAreaElOff);
  }

  //setListenerOpenChatInBatchMode();
  const intervalId = setInterval(async function () {
    // const incomeMessageArchiveIndicator = document.querySelector("div.hlFup > span");
    await setListenerOpenChatInBatchModeHtmlChats();
    window.clearTimeout(addActiveHiddenChatTimeout)
    window.clearTimeout(addHiddenChatTimeout)
  }, 900);
  devprint("STATUS: UI attached.");
}

/*export function setListenerOpenChatInBatchMode() {
  let dialogItems = document.querySelectorAll('div.lhggkp7q.ln8gz9je.rx9719la');
  let chatsInBatchMode = JSON.parse (localStorage.getItem ("chatsInBatchMode"));
  let dialogItemChatsInBatchMode = [];


  dialogItems.forEach(item => {
    chatsInBatchMode.forEach(chatInBatchMode => {
      const itemName = item.querySelector('.zoWT4').querySelector('span').textContent;
      const hasUnread = item.querySelector('.l7jjieqr.il1gyv3w');

      let chatInBatchModeName;
      if (chatInBatchMode.name != null) {
        chatInBatchModeName = chatInBatchMode.name;
      }
      if (chatInBatchMode.title != null) {
        chatInBatchModeName = chatInBatchMode.title;
      }
      if (itemName == chatInBatchModeName) {
        dialogItemChatsInBatchMode.push(item)
      }
    });
  });


  for (let index = 0; index < chatsInBatchMode.length; index++) {


    if (chatsInBatchMode[index].timeToAddInBatchMode != null) {
      const dateAddInBatchMode = new Date(chatsInBatchMode[index].timeToAddInBatchMode);
      const currentDate = new Date()
      let hoursLeft = (currentDate - dateAddInBatchMode)/3600000;
      if (hoursLeft < 0.0166667) {

        setTimeout(() => {
          archiveChatLocally(chatsInBatchMode[index]);
        }, 2500);
        setTimeout(() => {
          unArchiveChatLocally(chatsInBatchMode[index]);
        }, 0.0166667 - hoursLeft);
      }else{
        setTimeout(() => {
          unArchiveChatLocally(chatsInBatchMode[index]);
        }, 60000);
      }
    }
  }

  dialogItemChatsInBatchMode.forEach(item => {
    item.addEventListener('click', function (event) {
        console.log('Open Chat With Batch Mode');
        itemName = item.querySelector('.zoWT4').querySelector('span').textContent;
        let object = chatsInBatchMode.find(chatsInBatchMode => chatsInBatchMode.title === itemName || chatsInBatchMode.name === itemName);
        object.timeToAddInBatchMode = new Date();
        let newChatsInBatchMode = chatsInBatchMode.filter((item) => item.id !== object.id);
        newChatsInBatchMode.push(object);
        localStorage.setItem ("chatsInBatchMode", JSON.stringify(newChatsInBatchMode));
        setTimeout(() => {
          archiveChatLocally(object);
        }, 1500);
    });
  });
}
*/

localStorage.setItem("chatInBatchModeChanged", "true");

function handleActiveChatInBatchMode(itemName: string, chat: any, chatInBatchMode: any){
  window.setTimeout(() => {
    if(itemName === chat.title){
      console.log("hiding chat2... ", chat);
      addHiddenChats(chatInBatchMode);
    }
    handleActiveChatInBatchModeCounter = 0;
  }, 10000);
}

async function setListenerOpenChatInBatchModeHtmlChats() {
  let dialogItems = document.querySelectorAll("div.lhggkp7q.ln8gz9je.rx9719la");
  let chatsInBatchMode = JSON.parse(localStorage.getItem("chatsInBatchMode"));
  let dialogItemChatsInBatchMode = [];

  let chatInBatchModeChanged =
    localStorage.getItem("chatInBatchModeChanged") === "true" ? true : false;

  dialogItems.forEach((item, index_html) => {
    chatsInBatchMode && chatsInBatchMode.forEach((chatInBatchMode, index) => {
      const itemName = item.querySelector(".zoWT4").querySelector("span").textContent;
      const hasUnread =
        item.querySelector(".l7jjieqr.aumms1qt.ei5e7seu") === null ? false : true;
      let chatInBatchModeName: string;
      if (chatInBatchMode.name != null) {
        chatInBatchModeName = chatInBatchMode.name;
      }
      if (chatInBatchMode.title != null) {
        chatInBatchModeName = chatInBatchMode.title;
      }

      WWEvents.on(InternalEvent.CHAT_CHANGED_UNREAD_COUNT, async (chat: any) => {
        if (chatInBatchModeChanged) {
          window.setTimeout(() => {
            if (chatInBatchModeName === chat.title) {
              if (chat.hasUnread) {
                removeHiddenChats(chatInBatchMode);
                return;
              }
            }
            localStorage.setItem("chatInBatchModeChanged", "false");
          }, 10000);
          return;
        }
        if (chatInBatchModeChanged === false) {
          if (chatInBatchModeName === chat.title) {
            if (chat.hasUnread) {
              window.clearTimeout(addHiddenChatTimeout);
              removeHiddenChats(chatInBatchMode);
              return;
            }
            return;
          }
        }
      });

      if (itemName === chatInBatchModeName) {
        getOpenedChat((chat: any) => {
          if (chat === undefined) {
            if (hasUnread) {
              console.log("hasUnread: ", hasUnread);
            } else {
              console.log("hiding chat... ", chat);
              dialogItemChatsInBatchMode.push(item);
              return addHiddenChats(chatInBatchMode);
            }
            return true;
          }
          if (chat.title === chatInBatchModeName) {
            if (!hasUnread) {
              //call handleActiveChatInBatchMode function
              if(handleActiveChatInBatchModeCounter === 0){
                handleActiveChatInBatchMode(itemName, chat, chatInBatchMode)
                handleActiveChatInBatchModeCounter = 1
              }else{
                return console.assert('run timeout only once')
              }
            } else {
              console.assert("removing chat... ", chat);
              return removeHiddenChats(chatInBatchMode);
            }
          } else {
            if (!hasUnread) {
              handleActiveChatInBatchModeCounter = 0;
              return addHiddenChats(chatInBatchMode);
            } else {
              console.assert("removing chat2... ", chat);
              return removeHiddenChats(chatInBatchMode);
            }
          }
        });
      }
    });
  });

  //when chat is opened in batch mode
  dialogItemChatsInBatchMode.forEach((item) => {
    item.addEventListener("click", function (event) {
      console.log("Open Chat With Batch Mode");
      let activeChatInBatchMode = item
        .querySelector("div[aria-selected]")
        .getAttribute("aria-selected");
      const hasUnread =
        item.querySelector(".l7jjieqr.aumms1qt.ei5e7seu") === null ? false : true;
      let itemName = item.querySelector(".zoWT4").querySelector("span").textContent;
      let object = chatsInBatchMode.find(
        (chatsInBatchMode) =>
          chatsInBatchMode.title === itemName || chatsInBatchMode.name === itemName,
      );
      object.timeToAddInBatchMode = new Date();
      let newChatsInBatchMode = chatsInBatchMode.filter((item) => item.id !== object.id);
      localStorage.setItem("chatsInBatchMode", JSON.stringify(newChatsInBatchMode));
      if (activeChatInBatchMode === "true") {
        if (hasUnread) {
          window.setTimeout(() => {
            removeHiddenChats(object);
          }, 10000);
        }
      } else {
        if (!hasUnread) {
          newChatsInBatchMode.push(object);
          window.setTimeout(() => {
            addHiddenChats(object);
          }, 2500);
        }
      }
    });
  });
}
