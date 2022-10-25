import browser from "webextension-polyfill";
import {Selectors} from "../../../../data/dictionary";
import {constructFakeCtxMenuItem} from "../../../user-can/use-zen-mode-ctx-menu/construct-zen-mode-ctx-menu-item";
import {DOM} from "../../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {set_el_style} from "../../../../../utility-belt/helpers/dom/set-el-style";
import {hide_WA_context_menu} from "../../../../api/hide-wa-context-menu";
import {lastHoveredChat} from "./attach_hide_contact_item";

export function construct_batch_mode_ctx_menu_item(
  chatWithBatchMode: boolean,
): HTMLLIElement {
  /*const menuItemEl = constructFakeCtxMenuItem(
    [browser.i18n.getMessage("WA_contactCtxMenuItem_batchMode")],
    getPopup
  );*/

  const iconUrl = browser.runtime.getURL("assets/whatsapp/batch-mode-icon.png");
  const img = DOM.create_el({
    tag: "img",
    attributes: {src: iconUrl, id: "WA_contactCtxMenuItem_batchMode_id"},
  });

  set_el_style(img, {
    width: "20px",
    'margin-right': "6px",
    'margin-left': "2px",
  })
  img.style.verticalAlign = 'middle'

  const menuItemEl = constructFakeCtxMenuItem(
    [
      img,
      browser.i18n.getMessage(
        chatWithBatchMode
          ? "WA_contactCtxMenuItem_batchMode_on"
          : "WA_contactCtxMenuItem_batchMode",
      ),
    ],
    () => {
      chatWithBatchMode ? getPopupOffBatchMode() : getPopup();
    },
  );

  menuItemEl.id = Selectors.ZM_BATCH_MODE_CTX_MENU_ITEM.substring(1);
  return menuItemEl;
}

function getPopup() {
  set_el_style(DOM.get_el(Selectors.ZM_BATCH_MODE_POPUP), {display: "initial"});
}

function getPopupOffBatchMode() {
  set_el_style(DOM.get_el(Selectors.ZM_BATCH_MODE_POPUP_OFF), {display: "initial"});
}

function getAllChatsInBatchMode() {
  return JSON.parse(localStorage.getItem("chatsInBatchMode"));
}
