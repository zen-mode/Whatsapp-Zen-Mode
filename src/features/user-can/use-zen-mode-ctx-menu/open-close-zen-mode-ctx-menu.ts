import {set_el_style} from "../../../../utility-belt/helpers/dom/set-el-style";
import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";

import {Selectors} from "../../../data/dictionary";

export function open_ZM_ctx_menu(): void {
  const ctxMenuEl = DOM.get_el(Selectors.ZM_CTX_MENU) as Element;
  set_el_style(ctxMenuEl, {display: "initial"});
}

export function close_ZM_ctx_menu(): void {
  const ctxMenuEl = DOM.get_el(Selectors.ZM_CTX_MENU) as Element;
  set_el_style(ctxMenuEl, {display: "none"});
}
