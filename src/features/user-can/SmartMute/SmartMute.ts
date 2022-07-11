import browser from "webextension-polyfill";
import {get_extn_storage_item_value, set_extn_storage_item} from "../../../../utility-belt/helpers/extn/storage";
import {Selectors, StateItemNames} from "../../../data/dictionary";
import {
  turnOffChatsSounds, turnOnChatsSounds
} from "../../../whatsapp/ExtensionConnector";
import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {set_el_attributes} from "../../../../utility-belt/helpers/dom/set-el-attributes";

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

export function construct_smartMute_menu_item(): HTMLElement {
  const text = browser.i18n.getMessage("ZM_ctxMenuItem_smartMute_ON");
  const menuItem = document.createElement('DIV');
  set_el_attributes(menuItem, {
    id: Selectors.ZM_CTX_MENU_ITEM_SMARTMUTE.substring(1),
    title: browser.i18n.getMessage("ZM_ctxMenuItem_smartMute_desc"),
    class: 'ZenMode__contextMenuItem__withIcon'
  });
  const textEl = DOM.create_el({
    tag: 'span',
    attributes: {
      id: Selectors.ZM_SMARTMUTE_TEXT.substring(1)
    },
    text
  });
  const soundIconEl = DOM.create_el({
    tag: 'i',
    attributes: {
      id: Selectors.ZM_SMARTMUTE_SOUNDICON.substring(1)
    },
    html: SWITCH_ON
  });
  menuItem.append(textEl, soundIconEl);

  return menuItem;
}

export async function toggleSmartMute(): Promise<void> {
  // Set state
  const smartMuteStatus = await getSmartMuteStatus();
  await setSmartMuteStatus(!smartMuteStatus);
}

export async function setSmartMuteStatus(smartMuteStatus: boolean): Promise<void> {
  // Save to storage
  await set_extn_storage_item({
    [StateItemNames.SMART_MUTE_STATUS]: smartMuteStatus
  });
  // Render changes
  if (smartMuteStatus) {
    turnOffChatsSounds();
  } else {
    turnOnChatsSounds();
  }
  const smartMuteItem = DOM.get_el(Selectors.ZM_CTX_MENU_ITEM_SMARTMUTE);
  if (smartMuteItem) {
    const smartMuteText = DOM.get_el(Selectors.ZM_SMARTMUTE_TEXT, smartMuteItem);
    const smartMuteIcon = DOM.get_el(Selectors.ZM_SMARTMUTE_SOUNDICON, smartMuteItem);
    if (smartMuteText && smartMuteIcon) {
      smartMuteText.textContent = smartMuteStatus
        ? browser.i18n.getMessage("ZM_ctxMenuItem_smartMute_OFF")
        : browser.i18n.getMessage("ZM_ctxMenuItem_smartMute_ON");
      smartMuteIcon.innerHTML = smartMuteStatus ? SWITCH_ON : SWITCH_OFF;
    }
    smartMuteItem.style.color = smartMuteStatus ? 'var(--active-tab-marker)' : '';
  }
}

export async function getSmartMuteStatus(): Promise<boolean> {
  return Boolean(await get_extn_storage_item_value(StateItemNames.SMART_MUTE_STATUS));
}


