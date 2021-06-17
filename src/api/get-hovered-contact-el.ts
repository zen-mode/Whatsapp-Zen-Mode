import {Selectors} from "../data/dictionary";

import {DOM} from "../../utility-belt/helpers/dom/DOM-shortcuts";

export function get_hovered_contact_el(): HTMLElement | null {
  return DOM.get_el(Selectors.WA_CONTACT_ELEMENT_HOVERED_DIV);
}
