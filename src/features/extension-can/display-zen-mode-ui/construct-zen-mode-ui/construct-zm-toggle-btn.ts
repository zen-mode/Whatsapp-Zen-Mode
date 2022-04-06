import {set_el_attributes} from "../../../../../utility-belt/helpers/dom/set-el-attributes";
import {get_extn_storage_item_value} from "../../../../../utility-belt/helpers/extn/storage";

import {Selectors, StateItemNames} from "../../../../data/dictionary";
import ZMCtxMenu from "../../../../whatsapp/ui/FakeCtxMenu/ZMCtxMenu";
import {set_el_style} from "../../../../../utility-belt/helpers/dom/set-el-style";
import browser from "webextension-polyfill";

export function constructZMMenuButton(): HTMLDivElement {

  const ZenModeBtnEl = document.createElement("div");
  set_el_attributes(ZenModeBtnEl, {
    id: Selectors.ZM_TOGGLE_BUTTON.substring(1),
    class: 'ZenModeLogo'
  });
  set_el_style(ZenModeBtnEl, {
    "background-image": `url('${browser.runtime.getURL('assets/logo/logo.png')}')`
  });
  const toggleZMMenuByClick = (e: MouseEvent) => {
    e.stopPropagation();
    if (ZMCtxMenu.isVisible) {
        ZMCtxMenu.isVisible = false;
    } else {
        ZMCtxMenu.tieToAnchor(ZenModeBtnEl.getBoundingClientRect());
    }
  };
  // .addEventListener("click", toggle_Zen_mode);
  ZenModeBtnEl.addEventListener("click", toggleZMMenuByClick);
  ZenModeBtnEl.addEventListener("contextmenu", e => {
    e.preventDefault();
    toggleZMMenuByClick(e);
  });

  // Explain: Create or not badgeEl based on State.
  get_extn_storage_item_value(StateItemNames.RELEASE_NOTES_VIEWED)
    .then(isReleaseNotesViewed => {
      if (!isReleaseNotesViewed) {
        const badgeEl = document.createElement("span");
        set_el_attributes(badgeEl, {
          id: Selectors.ZM_BADGE.substring(1),
        });

        ZenModeBtnEl.appendChild(badgeEl);
      }});

  return ZenModeBtnEl;
}
