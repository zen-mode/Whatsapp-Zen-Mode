import {set_el_attributes} from "../../../../../utility-belt/helpers/dom/set-el-attributes";
import browser from "webextension-polyfill";

import {Selectors} from "../../../../data/dictionary";
import {setZenMorning, unsetZenMorning} from "../../../user-can/zenmorning/setZenMorning";
import {constructFakeCtxMenuItem} from "../../../user-can/use-zen-mode-ctx-menu/construct-zen-mode-ctx-menu-item";
import {hide_WA_context_menu} from "../../../../api/hide-wa-context-menu";

export function construct_zenMorning_contact_ctx_menu_item(contactWithZenMorning: boolean): HTMLLIElement {
  const menuItemEl = constructFakeCtxMenuItem(
    [browser.i18n.getMessage(contactWithZenMorning
      ? "WA_contactCtxMenuItem_cancelZenMorning"
      : "WA_contactCtxMenuItem_zenMorning"
    )],
    () => {
      (contactWithZenMorning
          ? unsetZenMorning()
          : setZenMorning()
      );
      hide_WA_context_menu();
    }
  )
  set_el_attributes(menuItemEl, {
    id: Selectors.ZM_ZENMORNING_CONTACT_CTX_MENU_ITEM.substring(1),
  });

  return menuItemEl;
}
