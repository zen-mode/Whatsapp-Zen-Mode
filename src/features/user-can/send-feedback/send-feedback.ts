import {construct_zen_mode_ctx_menu_item} from "../use-zen-mode-ctx-menu/construct-zen-mode-ctx-menu-item";
import {browser} from "webextension-polyfill-ts";

import {URLS} from "../../../data/dictionary";

export function construct_send_feedback_menu_item(): HTMLLIElement {
  const text = browser.i18n.getMessage("ZM_ctxMenuItem_contactUs");
  return construct_zen_mode_ctx_menu_item(text, action);
}

function action(): void {
  const subject = "Zen Mode extension feedback";

  // Explain: Decided to drop due to inconsistency in line breaks bw web and native email clients.
  // Keep for ref until 01.01.22.
  // const body = `
  // Things I don't enjoy about Zen Mode:
  // <br/><br/>
  // Things I like:
  // <br/><br/>
  // Anything else%3F:`;
  //
  // window.open(`${URLS.FEEDBACK_EMAIL}?subject=${subject}&body=${body}`);

  window.open(`${URLS.FEEDBACK_EMAIL}?subject=${subject}`);
}
