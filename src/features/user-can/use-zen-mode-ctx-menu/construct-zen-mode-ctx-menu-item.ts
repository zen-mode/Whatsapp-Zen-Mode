import {hide_WA_context_menu} from "../../../api/hide-wa-context-menu";
import {set_el_attributes} from "../../../../utility-belt/helpers/dom/set-el-attributes";

import {Selectors} from "../../../data/dictionary";

import {GenericFn} from "../../../../utility-belt/types/generic-types";

export function construct_zen_mode_ctx_menu_item(
  text: string,
  action: GenericFn,
): HTMLLIElement {
  const menuItemEl = document.createElement("li");
  set_el_attributes(menuItemEl, {
    // class: `${Selectors.WA_CONTACT_CTX_MENU_LIST_ITEM}
    class: `${Selectors.ZM_CTX_MENU_ITEM.substring(1)}`,
  });
  menuItemEl.addEventListener("click", (evt: Event) => {
    evt.stopImmediatePropagation();
    action();
    hide_WA_context_menu();
  });

  const menuItemContentEl = document.createElement("div");
  set_el_attributes(menuItemContentEl, {
    class: Selectors.WA_CONTACT_CTX_MENU_ITEM_CONTENTS_DIV.replaceAll(".", "").replaceAll(
      ",",
      "",
    ),
  });
  // Explain: By design.
  // eslint-disable-next-line functional/immutable-data
  menuItemContentEl.textContent = text;

  menuItemEl.appendChild(menuItemContentEl);

  return menuItemEl;
}
