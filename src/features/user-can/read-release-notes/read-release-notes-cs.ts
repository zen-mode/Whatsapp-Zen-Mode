import {construct_zen_mode_ctx_menu_item} from "../use-zen-mode-ctx-menu/construct-zen-mode-ctx-menu-item";
import {browser} from "webextension-polyfill-ts";
import {set_el_style} from "../../../../utility-belt/helpers/dom/set-el-style";
import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {remove_badge_el} from "./remove-ver-num-badge";

import {Selectors, StateItemNames} from "../../../data/dictionary";
import {set_extn_storage_item} from "../../../../utility-belt/helpers/extn/storage";

export function construct_read_release_notes_menu_item(): HTMLLIElement {
  const text = browser.i18n.getMessage("ZM_ctxMenuItem_releaseNotes");
  return construct_zen_mode_ctx_menu_item(text, action);
}

function action(): void {
  const releaseNotesAreaEl = DOM.get_el(Selectors.ZM_RELEASE_NOTES_AREA);
  set_el_style(releaseNotesAreaEl, {display: "initial"});

  remove_badge_el();

  void set_extn_storage_item({[StateItemNames.RELEASE_NOTES_VIEWED]: true});
}
