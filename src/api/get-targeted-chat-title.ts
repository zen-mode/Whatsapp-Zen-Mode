import {DOM} from "../../utility-belt/helpers/dom/DOM-shortcuts";

import {Selectors} from "../data/dictionary";

export function get_targeted_chat_raw_title(): string | null {
  const targetedChatTitleEl = DOM.get_el(Selectors.WA_TARGETED_CHAT_TITLE) as HTMLElement | null;
  if (targetedChatTitleEl) {
    return targetedChatTitleEl.getAttribute('title') as string;
  } else {
    return null;
  }
}
