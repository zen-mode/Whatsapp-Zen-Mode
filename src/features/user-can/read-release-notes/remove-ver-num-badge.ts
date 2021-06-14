import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {set_extn_storage_item} from "../../../../utility-belt/helpers/extn/storage";

import {Selectors, StateItemNames} from "../../../data/dictionary";

export function remove_badge_el(): void {
  DOM.remove_el(Selectors.ZM_BADGE);
}
