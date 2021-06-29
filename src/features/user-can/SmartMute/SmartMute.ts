import {browser} from "webextension-polyfill-ts";
import {get_extn_storage_item_value, set_extn_storage_item} from "../../../../utility-belt/helpers/extn/storage";
import {Selectors, SOUND_OFF_HTML, SOUND_ON_HTML, StateItemNames} from "../../../data/dictionary";
import {
  turnOffChatsSounds, turnOnChatsSounds
} from "../../../whatsapp/ExtensionConnector";
import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {set_el_attributes} from "../../../../utility-belt/helpers/dom/set-el-attributes";

export function construct_smartMute_menu_item(): HTMLElement {
  const text = browser.i18n.getMessage("ZM_ctxMenuItem_smartMute_ON");
  const menuItem = document.createElement('DIV');
  set_el_attributes(menuItem, {
    id: Selectors.ZM_CTX_MENU_ITEM_SMARTMUTE.substring(1),
    title: browser.i18n.getMessage("ZM_ctxMenuItem_smartMute_desc")
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
    html: SOUND_ON_HTML
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
      smartMuteIcon.innerHTML = smartMuteStatus ? SOUND_OFF_HTML : SOUND_ON_HTML;
    }
    smartMuteItem.style.color = smartMuteStatus ? 'var(--active-tab-marker)' : '';
  }
}

export async function getSmartMuteStatus(): Promise<boolean> {
  return Boolean(await get_extn_storage_item_value(StateItemNames.SMART_MUTE_STATUS));
}


