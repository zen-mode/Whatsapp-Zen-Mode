import {DOM} from "../../utility-belt/helpers/dom/DOM-shortcuts";
import {set_el_style} from "../../utility-belt/helpers/dom/set-el-style";

import {Selectors} from "../data/dictionary";
import {devprint} from "../../utility-belt/helpers/debug/devprint";

export function hide_WA_context_menu(): void {
  const WA_ctxMenuEl = DOM.get_el(Selectors.WA_CONTACT_CTX_MENU) as Element;
  devprint("WA_ctxMenuEl=", WA_ctxMenuEl);
  devprint("hide_WA_context_menu");
  set_el_style(WA_ctxMenuEl, {display: "none"});
}
