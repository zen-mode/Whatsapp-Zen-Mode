import {ChatNode} from "./ChatNode";
import {subscribeForeverZenMorningChatChanges} from "../Storage";
import * as DOMReference from "./DOMConstants";
import * as DOMConstants from "./DOMConstants";
import * as DOMObserver from "./DOMObserver";
import {getMainListChatElements} from "./DOMReference";
import {clearSun, setSunTo} from "../ui/ZenMorningMediator";

let _zenMorningChat = null;

const chatListWatcher = new MutationObserver((mutations) => {
  for (let i = mutations.length - 1; i > -1; i--) {
    const m = mutations[i];
    if (m.addedNodes.length) {
      onChatListUpdated(m);
    }
  }
});

function cE(e) {
  return e.nodeType === Node.ELEMENT_NODE
    && e.tagName !== 'SVG'
    && e.tagName !== 'IMG'
    && e.tagName !== 'path'
    && e.id !== DOMConstants.ZEN_MORNING_SUN_ID
}

function onChatListUpdated(m) {
  if (_zenMorningChat) {
    const addedNodes = m.addedNodes;
    if (addedNodes) {
      for (let i = addedNodes.length - 1; i > -1; i--) {
        const e = addedNodes[i];
        if (cE(e)) {
          updateChatElementState(e);
        }
      }
    }
  }
}

function updateChatElementState(e) {
  const chatNode = new ChatNode(e, true, false);
  const title = chatNode.title();
  if (_zenMorningChat && _zenMorningChat.title === title) {
      setSunTo(chatNode);
    } else {
      clearSun(chatNode.node);
    }
}

function refreshVisibleChatsState() {
  getMainListChatElements().forEach(updateChatElementState);
}

subscribeForeverZenMorningChatChanges((chat) => {
  _zenMorningChat = chat;
  refreshVisibleChatsState();
});

DOMObserver.observerOn(chatListWatcher
  , () => {
    refreshVisibleChatsState();
    return document.querySelector(DOMReference.CHAT_LIST_SELECTOR);
  }
  , () => {
    var e = document.querySelector(DOMReference.CHAT_LIST_SELECTOR);
    return e ? e.hasChildNodes() : false;
  }
  , {
    attributes: false,
    childList: true,
    subtree: true,
    characterData: false,
  });
