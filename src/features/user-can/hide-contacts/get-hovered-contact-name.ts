import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {throw_DOM_error} from "../../extension-can/process-errors/process-error";
import {get_hovered_contact_el} from "../../../api/get-hovered-contact-el";
import {clean_of_non_std_chars} from "../../../../utility-belt/helpers/string/clean";

import {Selectors} from "../../../data/dictionary";

export function get_hovered_contact_name(): string {
  const hoveredDivEl = get_hovered_contact_el();
  if (!hoveredDivEl)
    throw_DOM_error(
      Selectors.WA_CONTACT_ELEMENT_HOVERED_DIV,
      "WA_CONTACT_ELEMENT_HOVERED_DIV",
    );
  const contactNameEl = DOM.get_el(
    Selectors.WA_CONTACT_NAME,
    hoveredDivEl as HTMLElement,
  );
  if (!contactNameEl) {
    throw_DOM_error(Selectors.WA_CONTACT_NAME, "WA_CONTACT_NAME");
  }
  const rawText = (contactNameEl as HTMLElement).textContent as string;
  // Explain: If contact name contains emojis - we must get rid of them.
  return clean_of_non_std_chars(rawText);
}

export function get_hovered_contact_raw_title(): string {
  const hoveredDivEl = get_hovered_contact_el();
  if (!hoveredDivEl)
    throw_DOM_error(
      Selectors.WA_CONTACT_ELEMENT_HOVERED_DIV,
      "WA_CONTACT_ELEMENT_HOVERED_DIV",
    );
  const contactNameEl = DOM.get_el(
    Selectors.WA_CONTACT_NAME,
    hoveredDivEl as HTMLElement,
  );
  if (!contactNameEl) {
    throw_DOM_error(Selectors.WA_CONTACT_NAME, "WA_CONTACT_NAME");
  }
  return (contactNameEl as HTMLElement).getAttribute('title') as string;
}
