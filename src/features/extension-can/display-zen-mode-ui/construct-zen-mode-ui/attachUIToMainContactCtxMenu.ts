import {DOM} from "../../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {get_hovered_contact_el} from "../../../../api/get-hovered-contact-el";
import {throw_DOM_error} from "../../process-errors/process-error";

import {Selectors} from "../../../../data/dictionary";
import {getOpenedChat} from "../../../../whatsapp/ExtensionConnector";
import {toggle_Zen_mode} from "../../../user-can/toggle-zen-mode/cs/toggle-zen-mode";
import browser from "webextension-polyfill";
import {constructFakeCtxMenuItem} from "../../../user-can/use-zen-mode-ctx-menu/construct-zen-mode-ctx-menu-item";
import {constructZenModeLogoIcon} from "../../../../api/getZenModeIcon";
import {hide_WA_context_menu} from "../../../../api/hide-wa-context-menu";

export function attachUIToMainContactCtxMenu(node: HTMLElement): void {
  const hoveredDivEl = get_hovered_contact_el();
  if (hoveredDivEl) return;
  const waContactCtxMenuEl = DOM.get_el(Selectors.WA_CONTACT_CTX_MENU);
  if (!waContactCtxMenuEl) {
    throw_DOM_error(Selectors.WA_CONTACT_CTX_MENU, "WA_CONTACT_CTX_MENU");
    return;
  }
  const waContactCtxMenuListEl = DOM.get_el("ul > div", waContactCtxMenuEl);
  if (!waContactCtxMenuListEl) {
    throw_DOM_error(Selectors.WA_CONTACT_CTX_MENU, "WA_CONTACT_CTX_MENU");
    return;
  }

  getOpenedChat(async (openedChat) => {
    const zenModeIcon = await constructZenModeLogoIcon();
    zenModeIcon.classList.add('ZenModeLogoInlined');
    const zenModeItemEl = constructFakeCtxMenuItem(
      [browser.i18n.getMessage('ZM_ctxMenuItem_zenMode'), zenModeIcon],
      () => {
        toggle_Zen_mode();
        hide_WA_context_menu();
      }
    );
    zenModeItemEl.classList.add('first');
    waContactCtxMenuListEl.append(zenModeItemEl);
    waContactCtxMenuListEl.click(); // Corrects ctx menu visualization.
  });
}
