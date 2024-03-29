import browser from "webextension-polyfill";
import {Selectors} from "../../../../data/dictionary";
import {constructFakeCtxMenuItem} from "../../../user-can/use-zen-mode-ctx-menu/construct-zen-mode-ctx-menu-item";
import {DOM} from "../../../../../utility-belt/helpers/dom/DOM-shortcuts";
import { setMiniPreview, unsetMiniPreview } from "../../../user-can/mini-preview-contacts/mini-preview-contacts";
import {hide_WA_context_menu} from "../../../../api/hide-wa-context-menu";
import {lastHoveredChat} from "./attach_hide_contact_item";
const SWITCH_ON = `
    <!--<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 7H7a5 5 0 0 0-5 5 5 5 0 0 0 5 5h10a5 5 0 0 0 5-5 5 5 0 0 0-5-5m0 8a3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3 3 3 0 0 1-3 3Z"/>
    </svg>-->
    `;
const SWITCH_OFF = `
    <!--<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 6H7c-3.31 0-6 2.69-6 6s2.69 6 6 6h10c3.31 0 6-2.69 6-6s-2.69-6-6-6zm0 10H7c-2.21 0-4-1.79-4-4s1.79-4 4-4h10c2.21 0 4 1.79 4 4s-1.79 4-4 4zM7 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
    </svg>-->
`;
const SWITCH_OFF_TEXT = browser.i18n.getMessage("WA_contactCtxMenuItem_preview_off");
const SWITCH_ON_TEXT = browser.i18n.getMessage("WA_contactCtxMenuItem_preview_on");

const SWITCH_OFF_INNERHTML = `<div class='switch_text'>` + SWITCH_OFF_TEXT + `</div>` + `<i class="fakemenu_switcher">`+SWITCH_OFF+`</i>`;
const SWITCH_ON_INNERHTML = `<div class='switch_text'>` + SWITCH_ON_TEXT + `</div>` + `<i class="fakemenu_switcher">`+SWITCH_ON+`</i>`;

export function construct_mini_preview_ctx_menu_item(contactWithMiniPreview: boolean): HTMLLIElement {
  const iconEl = DOM.create_el({
    tag: "i",
    html: contactWithMiniPreview ? SWITCH_ON : SWITCH_OFF,
    attributes: {class: "fakemenu_switcher"}
  });

  const menuItemEl = constructFakeCtxMenuItem(
    [browser.i18n.getMessage(contactWithMiniPreview
      ? "WA_contactCtxMenuItem_preview_on"
      : "WA_contactCtxMenuItem_preview_off"
    ), iconEl],
    () => {
      (contactWithMiniPreview
          ? unsetMiniPreview()
          : setMiniPreview()
      );

      switchMenuItem();
      /*hide_WA_context_menu();*/
    }
  )
  menuItemEl.id = Selectors.ZM_PREVIEW_CONTACT_CTX_MENU_ITEM.substring(1);

  return menuItemEl;
}

function switchMenuItem() {
  let menuItem = document.getElementById('ZenMode__previewContact');
  if (menuItem != null && !menuItem.classList.contains('disable-item')) {
    if (menuItem.getElementsByClassName('_2oldI')[0].textContent.trim() == SWITCH_OFF_TEXT) {
      menuItem.getElementsByClassName('_2oldI')[0].innerHTML = SWITCH_ON_INNERHTML;
    }else{
      menuItem.getElementsByClassName('_2oldI')[0].innerHTML = SWITCH_OFF_INNERHTML;
    }

    menuItem.classList.add('disable-item');
  }
}
