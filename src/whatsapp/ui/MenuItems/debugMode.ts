import browser from "webextension-polyfill";
import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {set_el_attributes} from "../../../../utility-belt/helpers/dom/set-el-attributes";
import {
  get_extn_storage_item_value,
  set_extn_storage_item,
} from "../../../../utility-belt/helpers/extn/storage";
import {Selectors, StateItemNames} from "../../../data/dictionary";
import ZMCtxMenu, {debugModeActions, debugModeItems} from "../FakeCtxMenu/ZMCtxMenu";

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

export function constructDebugModeMenuItem(): HTMLElement {
  const text = browser.i18n.getMessage("ZM_ctxMenuItem_debug_mode");

  const menuItem = document.createElement("DIV");
  set_el_attributes(menuItem, {
    id: Selectors.ZM_CTX_MENU_ITEM_DEBUG_MODE.substring(1),
    class: "ZenMode__contextMenuItem__withIcon ZenMode_debugMode",
  });
  const textEl = DOM.create_el({
    tag: "span",
    attributes: {
      id: Selectors.ZM_CTX_MENU_ITEM_DEBUG_TEXT.substring(1),
    },
    text,
  });
  const soundIconEl = DOM.create_el({
    tag: "i",
    attributes: {
      id: Selectors.ZM_CTX_MENU_ITEM_DEBUG_SWITCH_ICON.substring(1),
    },
    html: SWITCH_OFF,
  });
  menuItem.append(textEl, soundIconEl);

  return menuItem;
}

export async function getDebugModeStatus(): Promise<boolean> {
  return Boolean(await get_extn_storage_item_value(StateItemNames.DEBUG_MODE_STATUS));
}

export async function setDebugModeStatus(debugModeStatus: boolean): Promise<void> {
  await set_extn_storage_item({
    [StateItemNames.DEBUG_MODE_STATUS]: debugModeStatus,
  });

  const debugModeIndicator = DOM.get_el(Selectors.ZM_DEBUG_MODE_INDICATOR);
  if (debugModeIndicator) {
    debugModeIndicator.innerText = debugModeStatus
      ? browser.i18n.getMessage("ZM_ctxMenuItem_debug_mode")
      : "";
  }

  const debugModeIcon = DOM.get_el(Selectors.ZM_CTX_MENU_ITEM_DEBUG_SWITCH_ICON);
  if (debugModeIcon) {
    debugModeIcon.innerHTML = debugModeStatus ? SWITCH_ON : SWITCH_OFF;
  }

  if (debugModeStatus) {
    ZMCtxMenu.addItems(debugModeItems);
  } else {
    ZMCtxMenu.removeItems(debugModeActions);
  }
}

export async function toggleDebugMode(): Promise<void> {
  const debugModeStatus = await getDebugModeStatus();
  await setDebugModeStatus(!debugModeStatus);
}
