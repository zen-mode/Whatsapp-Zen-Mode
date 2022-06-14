import browser from "webextension-polyfill";
import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {set_el_attributes} from "../../../../utility-belt/helpers/dom/set-el-attributes";
import { get_extn_storage_item_value, set_extn_storage_item } from "../../../../utility-belt/helpers/extn/storage";
import { StateItemNames } from "../../../data/dictionary";
import "../../dom/DOMConstants";
import {
    ZM_CTX_MENU_ITEM_PINNED_STATUS_BUTTON_ID, 
    ZM_CTX_MENU_ITEM_PINNED_STATUS_ID,
    ZM_CTX_MENU_ITEM_PINNED_STATUS_TEXT_ID
} from "../../dom/DOMConstants";

const SWITCH_ON = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h10a5 5 0 0 0 5-5 5 5 0 0 0-5-5m0 8a3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3Z"/>
    </svg>
    `;
const SWITCH_OFF = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 6H7c-3.31 0-6 2.69-6 6s2.69 6 6 6h10c3.31 0 6-2.69 6-6s-2.69-6-6-6zm0 10H7c-2.21 0-4-1.79-4-4s1.79-4 4-4h10c2.21 0 4 1.79 4 4s-1.79 4-4 4zM7 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
    </svg>
`;

export function buildPinnedChatsStatusMenuItem(): HTMLElement {
  const text = browser.i18n.getMessage('ZM_ctxMenuItem_pinned_status');

  const menuItem = document.createElement('div');
  set_el_attributes(menuItem, {
    id: ZM_CTX_MENU_ITEM_PINNED_STATUS_ID,
    class: "ZenMode__contextMenuItem__withIcon",
  });
  const textEl = DOM.create_el({
    tag: "span",
    attributes: {
      id: ZM_CTX_MENU_ITEM_PINNED_STATUS_TEXT_ID,
    },
    text,
  });
  const iconEl = DOM.create_el({
    tag: "i",
    attributes: {
      id: ZM_CTX_MENU_ITEM_PINNED_STATUS_BUTTON_ID,
    },
    html: SWITCH_OFF,
  });
  menuItem.append(textEl, iconEl);
  try {
    updateMenuItem(iconEl);
  } catch (e) {
    console.log(e)
  }

  return menuItem;
}

async function updateMenuItem(button: HTMLElement, enable: boolean | null = null) {
    if (button) {
        if (enable == null) {
            enable = await getStatusEnabled();
        }
        button.innerHTML = enable ? SWITCH_ON : SWITCH_OFF;
    }
}


async function getStatusEnabled(): Promise<boolean> {
    return Boolean(await get_extn_storage_item_value(StateItemNames.PINNED_CHATS_STATUS_ENABLED));
}

function setStatusEnabled(enabled: boolean) {
    set_extn_storage_item({
        [StateItemNames.PINNED_CHATS_STATUS_ENABLED]: enabled,
    });
}

export async function togglePinnedChatsStatusMode(): Promise<void> {
    const enabled = await getStatusEnabled();
    updateMenuItem(document.getElementById(ZM_CTX_MENU_ITEM_PINNED_STATUS_BUTTON_ID), !enabled);
    setStatusEnabled(!enabled);
}

