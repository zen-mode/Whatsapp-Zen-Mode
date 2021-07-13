import {Selectors} from "../data/dictionary";

export function get_contact_el_by_chat_name(chatTitle: string): HTMLElement | null {
  const titleEl = document.querySelector(`${Selectors.WA_CONTACT_CONTAINER}[title="${chatTitle}"]`);
  if (!titleEl) return null;
  return titleEl.closest(Selectors.WA_CONTACT_INFO_CONTAINER) as HTMLElement | null;
}
