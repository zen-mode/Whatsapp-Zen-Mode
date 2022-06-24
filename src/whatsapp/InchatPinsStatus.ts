import browser from "webextension-polyfill";
import { WWEvents } from "./extension/EventBus";
import { getPinnedChats, getOpenedChat } from "./ExtensionConnector";
import { Chat } from "./model/Chat";
import { Contact } from "./model/Contact";
import { subscribeForeverPinnedChatsStatusChanges } from "./Storage";
import { InternalEvent } from "./types";
import { get_extn_storage_item_value, set_extn_storage_item } from "../../utility-belt/helpers/extn/storage";
import { StateItemNames } from "../data/dictionary";
import {DOM} from "../../utility-belt/helpers/dom/DOM-shortcuts";

let wasShownOnboarding: boolean;
let openedChat: any;

async function getStatusOfOnboarding(): Promise<boolean> {
  return Boolean(await get_extn_storage_item_value(StateItemNames.WAS_SHOWN_PINNED_CHATS_STATUS_ONBOARDING));
}

function getChatContainer(): HTMLElement | null {
   return document.getElementById('inchat-status-container');
}

function getSelectorFromChat(chat: Chat) {
   const alph = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
   var newId = '';
   chat.id.split('@')[0]?.split('').forEach((num) => {
      newId += alph[num];
   })
   return newId;
}

function getChatItem(chat: Chat): HTMLElement | null {
   const container = getChatContainer();
   if (container) {
      return container.querySelector('#' + getSelectorFromChat(chat));
   } else {
      return null
   }
}

function injectContainerInChat() {
    let chatMessagesDiv = document.getElementsByClassName('_2gzeB')[0];
    if (chatMessagesDiv 
      && !getChatContainer()) {
        const div = document.createElement('div');
        div.id = 'inchat-status-container';
        chatMessagesDiv.append(div)
        return chatMessagesDiv
    }
    return null
}

function createBaseItem(chat: Chat, user: Contact, status: string = '') {
   const showUnreadMark = chat.unreadCount > 0 || chat.unreadCount == -1;
   
   const isActiveStatus = status === 'composing';

   const needToShow =  (showUnreadMark || isActiveStatus) && (openedChat.id != chat.id);

   var title;
   switch (status) {
      case 'composing':
         if (chat.isGroup) {
            title = browser.i18n.getMessage('pinnedChatsStatus_group_typing')
            .replace('%user_name', user.displayName)
            .replace('%chat_title', chat.title);
         } else {
            title = browser.i18n.getMessage('pinnedChatsStatus_user_typing')
            .replace('%chat_title', chat.title);
         }
         break;
      case 'recording':
         if (chat.isGroup) {
            title = browser.i18n.getMessage('pinnedChatsStatus_group_recording')
            .replace('%user_name', user.displayName)
            .replace('%chat_title', chat.title);
         } else {
            title = browser.i18n.getMessage('pinnedChatsStatus_user_recording')
            .replace('%chat_title', chat.title);
         }
         break;
      default:
         title = chat.title;
   } 

   const titleSpan = `
<span style="
   vertical-align: super;
   height: .75em;
   font-family: 'Inter';
   font-style: normal;
   font-weight: 400;
   font-size: 16px;
   line-height: 19px;
   color: black
   display: inline-table;
   padding-right: 5px;
">${title}</span>`;

   const unreadMark = showUnreadMark ? `
<div id="unreadMark">
<span style="
   display: block;
   margin: 2.5px 0.5px 0 0;
">${chat.unreadCount == -1 ? '' : chat.unreadCount}</span></div>` : '';

   const unreadIcon = `
<img src="${browser.runtime.getURL('assets/whatsapp/message.svg')}" style="
   height: 22px;
   width: 23px;
   margin-right: 10px;
   transform: translateY(10%);
   visibility: ${showUnreadMark ? 'visible' : 'hidden'};
">`
   // font-size: 12px;
   // vertical-align: super;
   // height: .75em;
   // line-height: .75em;

   const main = document.createElement('div');
   main.className = 'inchat-status-item';
   main.id = getSelectorFromChat(chat);
   const container = document.createElement('div');
   container.className = 'inchat-status-item-container';
   const body = document.createElement('div');
   body.innerHTML = `${unreadIcon}${unreadMark}${titleSpan}`;
   body.className = 'inchat-status-item-body';
   container.append(body);
   main.append(container);
   
   main.onclick = function(e) {
      main.remove();
   }

   if (!needToShow) {
      main.style.display = 'none';
   }
  if (needToShow && !wasShownOnboarding) {
    showOnboarding();
  }         
   return main;
}

function showOnboarding() {
  const container = getChatContainer();
  const onboardingContainer = DOM.create_el({
    tag: "div",
    attributes: {
      id: "pinned-chat-onborading",
    },
    text: browser.i18n.getMessage('pinned_chat_onboarding')
  });  
  const onboardingContainerClose = DOM.create_el({
    tag: "span",
    attributes: {
      id: "pinned-chat-onborading-close",
    },
    text: "x"
  });  
  onboardingContainer.append(onboardingContainerClose);
  container?.append(onboardingContainer);
  set_extn_storage_item({
    [StateItemNames.WAS_SHOWN_PINNED_CHATS_STATUS_ONBOARDING]: true
  });  
  onboardingContainerClose.addEventListener("click", function() {
    onboardingContainer.remove();
  });
  setTimeout(function() {
    onboardingContainer.remove();
  }, 10000)
  wasShownOnboarding = true;
}

function addChat(...chat: Chat[]) {
   const container = getChatContainer();
   if (container) {
      container.append(
         ...chat.map(c=>createBaseItem(c, cachedChatStatus[c.id]))
      );
   }
}

function removeChat(chat: Chat) {
   getChatItem(chat)?.remove();
}

function hasChat(chat: Chat): boolean {
   //console.log('hasChat', chat, getChatItem(chat));
   return Boolean(getChatItem(chat)); 
}

const cachedChatStatus = {}

function updateChat(chat: Chat, user: Chat, status: string = '') {
   if (!status) {
      status = cachedChatStatus[chat.id];
   } else {
      cachedChatStatus[chat.id] = status;
   }
   getChatItem(chat)?.remove();
   const container = getChatContainer();
   container?.insertBefore(createBaseItem(chat, user, status), container.firstChild);

}

WWEvents.on(InternalEvent.CHAT_CHANGED_STATUS, (chat: Chat, user: any, status: string) => {
   if (hasChat(chat)) {
      //console.log('New Status for ', chat.name, status)
      updateChat(chat, user, status);
   }
});

WWEvents.on(InternalEvent.CHAT_CHANGED_PIN, (chat: Chat) => {
   if (hasChat(chat)) {
      if (!chat.pinned) {
         removeChat(chat);
      }
   } else {
      if (chat.pinned) {
         addChat(chat);
      }
   }
});

WWEvents.on(InternalEvent.CHAT_CHANGED_UNREAD_COUNT, (chat: Chat) => {
  //console.log("CHAT_CHANGED_UNREAD_COUNT", chat);
   if (hasChat(chat)) {
      updateChat(chat, chat);
   }
});

let injectionInterval: ReturnType<typeof setInterval>;

function disableStatuses() {
   if (injectionInterval) {
      clearInterval(injectionInterval);
   }
   const container = getChatContainer();
   if (container) {
      container.remove();
   }
}

async function enableStatuses() {
  //console.log("ENABLING STATUSES");
  wasShownOnboarding = await getStatusOfOnboarding();  
  injectionInterval = setInterval(async function() {
    if (injectContainerInChat()) {
      //console.log("Injecting container in chat");
      openedChat = await new Promise(resolve => getOpenedChat(resolve));
      //console.log(openedChat);
      let pinnedChats = await getPinnedChats();
      //console.log("Getting pinned chats", pinnedChats);
      addChat(...pinnedChats);
    }
  }, 100);
}

subscribeForeverPinnedChatsStatusChanges((enabled: boolean) => {
   if (enabled) {
      enableStatuses();
   } else {
      disableStatuses();
   }
});