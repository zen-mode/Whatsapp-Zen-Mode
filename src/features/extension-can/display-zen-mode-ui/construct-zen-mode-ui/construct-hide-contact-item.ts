import {set_el_attributes} from "../../../../../utility-belt/helpers/dom/set-el-attributes";
import {browser} from "webextension-polyfill-ts";
import {hide_contact} from "../../../user-can/hide-contacts/hide-contact";

import {Selectors} from "../../../../data/dictionary";

export function construct_Hide_contact_ctx_menu_item(): HTMLLIElement {
  const menuItemEl = document.createElement("li");
  set_el_attributes(menuItemEl, {
    id: Selectors.ZM_HIDE_CONTACT_CTX_MENU_ITEM.substring(1),
  });

  // menuItemEl.addEventListener("click", hide_contact);
  menuItemEl.addEventListener("click", function () {
    hide_contact();
  }, true);

  const contentsEl = document.createElement("div");
  set_el_attributes(contentsEl, {
    class: Selectors.WA_CONTACT_CTX_MENU_ITEM_CONTENTS_DIV.replaceAll(".", "").replaceAll(
      ",",
      "",
    ),
    role: 'button'
  });
  // Explain: DOM construction in-memory.
  // eslint-disable-next-line functional/immutable-data
  contentsEl.innerText = browser.i18n.getMessage("WA_contactCtxMenuItem_hide");

  menuItemEl.appendChild(contentsEl);
  return menuItemEl;
}
