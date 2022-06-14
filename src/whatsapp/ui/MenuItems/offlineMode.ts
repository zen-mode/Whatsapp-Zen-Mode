import browser from "webextension-polyfill";
import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {set_el_attributes} from "../../../../utility-belt/helpers/dom/set-el-attributes";
import { set_el_style } from "../../../../utility-belt/helpers/dom/set-el-style";
import "../../dom/DOMConstants";
import { 
    ZM_CTX_MENU_ITEM_OFFLINE_MODE_BUTTON_ID,
    ZM_CTX_MENU_ITEM_OFFLINE_MODE_ICON_ID,
    ZM_CTX_MENU_ITEM_OFFLINE_MODE_ID,
    ZM_CTX_MENU_ITEM_OFFLINE_MODE_TEXT_ID 
} from "../../dom/DOMConstants";
import { 
    enableOfflineMode,
    isOfflineModeEnabled
} from "../../ExtensionConnector";

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

export function buildOfflineModeMenuItem(): HTMLElement {
  const text = browser.i18n.getMessage('ZM_ctxMenuItem_offline_mode');

  const menuItem = document.createElement('div');
  set_el_attributes(menuItem, {
    id: ZM_CTX_MENU_ITEM_OFFLINE_MODE_ID,
    class: "ZenMode__contextMenuItem__withIcon",
  });
  const textEl = DOM.create_el({
    tag: "span",
    attributes: {
      id: ZM_CTX_MENU_ITEM_OFFLINE_MODE_TEXT_ID,
    },
    text,
  });
  const iconEl = DOM.create_el({
    tag: "i",
    attributes: {
      id: ZM_CTX_MENU_ITEM_OFFLINE_MODE_BUTTON_ID,
    },
    html: SWITCH_OFF,
  });
  menuItem.append(textEl, iconEl);
  updateMenuItem(iconEl);

  return menuItem;
}

export function buildOfflineModeIcon(): HTMLElement {
  const icon = document.createElement('div');
  const iconUrl = browser.runtime.getURL('assets/whatsapp/offline-mode-icon.png');
  set_el_attributes(icon, {
      id: ZM_CTX_MENU_ITEM_OFFLINE_MODE_ICON_ID,
  });
  set_el_style(icon, {
    'background-image': `url(${iconUrl})`,
    display: 'none'
  });
  icon.addEventListener('click', () => {
    toggleOfflineMode();
  });
  return icon;
}

export function setOfflineModeIconVisible(visible: boolean) {
  const icon = document.getElementById(ZM_CTX_MENU_ITEM_OFFLINE_MODE_ICON_ID);
  set_el_style(icon, {
    display: visible ? 'block' : 'none'
  })
}

async function updateMenuItem(button: HTMLElement, enable: boolean | null = null) {
    if (button) {
        if (enable == null) {
            enable = await getDebugModeStatus();
        }
        button.innerHTML = enable ? SWITCH_ON : SWITCH_OFF;
    }
}

async function setOfflineMode(enable: boolean): Promise<void> {
    const button = document.getElementById(ZM_CTX_MENU_ITEM_OFFLINE_MODE_BUTTON_ID)
    if (button) {
        updateMenuItem(button, enable)
    }
    setOfflineModeIconVisible(enable)
    return await enableOfflineMode(enable)
  }

function getDebugModeStatus(): Promise<boolean> {
  return isOfflineModeEnabled()
}

export async function toggleOfflineMode(): Promise<void> {
    const enabled = await getDebugModeStatus();
    return setOfflineMode(!enabled);
}
