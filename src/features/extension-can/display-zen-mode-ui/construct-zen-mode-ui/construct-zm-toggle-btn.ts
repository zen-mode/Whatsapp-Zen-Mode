import {set_el_attributes} from "../../../../../utility-belt/helpers/dom/set-el-attributes";
import {toggle_Zen_mode} from "../../../user-can/toggle-zen-mode/cs/toggle-zen-mode";
import {get_extn_storage_item_value} from "../../../../../utility-belt/helpers/extn/storage";
import {set_el_style} from "../../../../../utility-belt/helpers/dom/set-el-style";
import {
  close_ZM_ctx_menu,
  open_ZM_ctx_menu,
} from "../../../user-can/use-zen-mode-ctx-menu/open-close-zen-mode-ctx-menu";

import {Selectors, StateItemNames} from "../../../../data/dictionary";
import {DOM} from "../../../../../utility-belt/helpers/dom/DOM-shortcuts";

export function construct_Zen_mode_toggle_btn(/*toggleState: boolean*/): HTMLDivElement {
  const ZenModeBtnEl = document.createElement("div");
  set_el_attributes(ZenModeBtnEl, {
    id: Selectors.ZM_TOGGLE_BUTTON.substring(1),
    // Explain: Keep for ref; actually handled in attach-zen-mode-iu.ts .
    // src: browser.runtime.getURL(
    //   `assets/logo/${toggleState ? "logo.png" : "logo-off.png"}`,
    // ),
    title: "Toggle Zen mode",
  });

  // Explain: No solution for the moment.
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  ZenModeBtnEl.addEventListener("click", toggle_Zen_mode);

  ZenModeBtnEl.addEventListener("contextmenu", open_ZM_ctx_menu);
  document.body.addEventListener("click", (evt) => {
    if ((evt.target as Element).id !== Selectors.ZM_CTX_MENU) close_ZM_ctx_menu();
  });

  const chevronEl = DOM.create_el({
    tag: "span",
    attributes: {id: Selectors.ZM_TOGGLE_BUTTON_CHEVRON.substring(1)},
    /* eslint-disable max-len*/
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 20" width="19" height="20">
        <path fill="currentColor" d="M3.8 6.7l5.7 5.7 5.7-5.7 1.6 1.6-7.3 7.2-7.3-7.2 1.6-1.6z"></path>
      </svg>
    `,
    /* eslint-enable max-len*/
  });
  chevronEl.addEventListener("click", (evt) => {
    evt.stopPropagation();
    open_ZM_ctx_menu();
  });
  ZenModeBtnEl.appendChild(chevronEl);

  // Explain: Create or not badgeEl based on State.
  void get_extn_storage_item_value(StateItemNames.RELEASE_NOTES_VIEWED)
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
