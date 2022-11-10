import browser from "webextension-polyfill";
import { WWEvents } from "./extension/EventBus";
import { getOpenedChat, openChat } from "./ExtensionConnector";
import { Chat } from "./model/Chat";
import { Contact } from "./model/Contact";
import { subscribeForeverPinnedChatsStatusChanges } from "./Storage";
import { InternalEvent } from "./types";
import { get_extn_storage_item_value, set_extn_storage_item } from "../../utility-belt/helpers/extn/storage";
import { StateItemNames } from "../data/dictionary";
import {DOM} from "../../utility-belt/helpers/dom/DOM-shortcuts";
import {isMiniPreviewChat} from "./Storage";
import {setMiniPreview, fetchMiniPreviewChats} from "../features/user-can/mini-preview-contacts/mini-preview-contacts";

let wasShownOnboarding: boolean;
let openedChat: any;

browser.runtime.onMessage.addListener(function(message) {
  const { type, payload } = message;
  console.log("GOT MESSAGE");
  switch (type) {
      case 'deleteMiniPreview': {
          const {chat} = payload;
          console.log(chat);
          removeChat(chat);
      }
  }
});

async function getStatusOfOnboarding(): Promise<boolean> {
  return Boolean(await get_extn_storage_item_value(StateItemNames.WAS_SHOWN_PINNED_CHATS_STATUS_ONBOARDING));
}

function showHiddenItemIfExistNewMessage() {
  let chatPinsItems = document.getElementsByClassName('inchat-status-item');
  if (chatPinsItems) {
    for (let item of chatPinsItems) {
      if (item.querySelector('.inchat-status-item-container .inchat-status-item-body #unreadMark')) {
        var newMessageCount = item.querySelector('.inchat-status-item-container .inchat-status-item-body #unreadMark span')!.textContent;
        if (newMessageCount && newMessageCount != localStorage.getItem(item.id+'-unreadCount')) {
          localStorage.setItem(item.id+'-unreadCount', newMessageCount);
          localStorage.setItem(item.id, 'show');
          document.getElementById(item.id)!.style.display = 'block';
        }
      }
    }
  }
}

/*function showHiddenItem() {

  let chatPinsItems = document.getElementsByClassName('inchat-status-item');
  console.log(chatPinsItems);
  if (chatPinsItems ) {
    for (let item of chatPinsItems) {
      if (item.querySelector('.unread-icon').style.visibility !== 'hidden') {
        document.getElementById(item.id)!.style.display = 'block';
      }
    }
  }
}*/


function getChatContainer(): HTMLElement | null {
  showHiddenItemIfExistNewMessage();
  //changeEyeColorIfExistDarkTheme();
  return document.getElementById('inchat-status-container');
}

/*function changeEyeColorIfExistDarkTheme() {
  if (document.querySelector('body').classList.contains('dark'))) {
    let eyes = document.getElementsByClassName('withPreview');
    if (eyes) {
      for (let item of eyes) {
        item.classList.add('withPreviewDark');
      }
    }
  }
}*/

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
      console.log("Injecting container in chat");
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

   const pinIcon = `
<img src="${browser.runtime.getURL('assets/whatsapp/pin.svg')}" class="pin-icon">`

   const titleSpan = `
<span class="inchat-title">${title}</span>`;

   const unreadMark = showUnreadMark ? `
<div id="unreadMark">
<span>${chat.unreadCount == -1 ? '' : chat.unreadCount}</span></div>` : '';

const hideMark = `
<div id="hideMark">
<span>x</span></div>`;

   const unreadIcon = `
<img src="${browser.runtime.getURL('assets/whatsapp/message.svg')}" class="unread-icon" style="visibility: ${showUnreadMark ? 'visible' : 'hidden'};">`

   const main = document.createElement('div');
   main.className = 'inchat-status-item' ;
   main.id = getSelectorFromChat(chat);
   main.className+=' ' + localStorage.getItem(main.id);
   const container = document.createElement('div');
   container.className = 'inchat-status-item-container';
   const body = document.createElement('div');
   body.innerHTML = `${hideMark}${pinIcon}${titleSpan}${unreadIcon}${unreadMark}`;
   body.className = 'inchat-status-item-body';


   body.querySelector('#hideMark')!.addEventListener('click', function(event) {
    event.stopPropagation();
    document.getElementById(main.id)!.style.display = 'none';
    localStorage.setItem(main.id, 'hidden');
    localStorage.setItem(main.id+'-unreadCount', String(chat.unreadCount));
  });
   container.append(body);
   main.append(container);

   main.onclick = function(e) {
    localStorage.setItem(main.id, 'show');
    localStorage.setItem(main.id+'-unreadCount', "0");
    openChat(chat);
    main.remove();
    openChat(chat);
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

export function removeChat(chat: Chat) {
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

WWEvents.on(InternalEvent.CHAT_CHANGED_STATUS, async (chat: Chat, user: any, status: string) => {
  const isMiniPreview = await isMiniPreviewChat(chat);
  if (isMiniPreview && !hasChat(chat)) {
    addChat(chat);
  } else if (isMiniPreview && hasChat(chat)) {
    updateChat(chat, user, status);
  } else {
    removeChat(chat);
  }
});

export function appendChat(chat: Chat) {
  !hasChat(chat) ? addChat(chat) : updateChat(chat, chat);
}

WWEvents.on(InternalEvent.CHAT_CHANGED_PIN, async (chat: Chat) => {
  const isMiniPreview = await isMiniPreviewChat(chat);
  if (!chat.pinned) {
    if (isMiniPreview) {
      appendChat(chat);
    } else {
      removeChat(chat);
    }
  } else {
    console.log("adding mini preview");
    setMiniPreview();
    appendChat(chat);
  }
});

WWEvents.on(InternalEvent.CHAT_CHANGED_UNREAD_COUNT, async (chat: Chat) => {
  console.log('[InternalEvent.CHAT_CHANGED_UNREAD_COUNT] New Status for ', chat.hasUnread, chat.title)
  const isMiniPreview = await isMiniPreviewChat(chat);
  if (isMiniPreview) {
    !hasChat(chat) ? addChat(chat) : updateChat(chat, chat);
  } else {
    removeChat(chat);
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
      openedChat = await new Promise(resolve => getOpenedChat(resolve));
      //console.log(openedChat);
      let chatsWithMiniPreview = await fetchMiniPreviewChats();
      //console.log(chatsWithMiniPreview);
      //console.log("Getting pinned chats", pinnedChats);
      addChat(...chatsWithMiniPreview);
      //showHiddenItem();
    }

    const tags = [...document.querySelectorAll('.inchat-status-item')];
    const ids = new Set(tags.map(x => x.id));
    tags.forEach(tag => {
      if(ids.has(tag.id)){
        ids.delete(tag.id);
      }
      else{
        tag.remove()
      }
    })
  }, 100);
}

subscribeForeverPinnedChatsStatusChanges((enabled: boolean) => {
  enabled ? enableStatuses() : disableStatuses();
});
