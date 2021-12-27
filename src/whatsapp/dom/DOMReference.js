import * as DOMConstants from "./DOMConstants";

export function getMainListChatElements() {
  return document.querySelector(DOMConstants.CHAT_LIST_SELECTOR)?.childNodes ?? [];
}
