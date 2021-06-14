import {throw_DOM_error} from "../features/extension-can/process-errors/process-error";
import {clean_of_non_std_chars} from "../../utility-belt/helpers/string/clean";
import {DOM} from "../../utility-belt/helpers/dom/DOM-shortcuts";

import {Selectors} from "../data/dictionary";

export function get_contact_el_by_chat_name(contactName: string): Element | null {
  // Explain: Cant use find_nodes_containing fn because if contact name contains icons - ..
  // it f*s up the fn algo; because icons will be represented as <img>'s, not text.
  // Keeping for clarity.
  // const [contactNameTextEl] = find_nodes_containing({

  // Explain: Collect all els that have 'title' attr; find the one that corresponds to contact name;
  // that will be the contact that we need.

  const allContactNameEls = DOM.get_els(Selectors.WA_CONTACT_NAME);
  const contactNameTextEl = allContactNameEls.find(
    (nameEl) => clean_of_non_std_chars(nameEl.title) === clean_of_non_std_chars(contactName),
  );
  // const get_els_with_title_attribute = () => DOM.get_els(`[title]`);
  // const find_text_el_corresponding_to_contact_name = () => DOM.get_els(`[title]`);
  // const contactNameTextEl = pipe(contactName, true).thru();
  // Explain: WA doesn't render all contacts at once. Only the ones that fit the height ..
  // of the contact list x2. So - it is real to not find the contact for a given contact name.
  if (!Boolean(contactNameTextEl)) return null;

  const contactSecondDivFromTop = (contactNameTextEl as Element).closest(
    Selectors.WA_CONTACT_SECOND_DIV,
  );
  if (!contactSecondDivFromTop)
    throw_DOM_error(Selectors.WA_CONTACT_SECOND_DIV, "WA_CONTACT_SECOND_DIV");

  return (contactSecondDivFromTop as Element).parentNode as Element;
}

// Explain: Keep for ref - in case we need to access contact list el.
// const contactListEl = DOM.get_el(Selectors.WA_CONTACT_LIST)
// if (!contactListEl)  {
//   throw_DOM_error(Selectors.WA_CONTACT_LIST, 'WA_CONTACT_LIST');
//     return
// };
