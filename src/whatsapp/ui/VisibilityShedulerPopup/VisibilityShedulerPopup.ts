import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";

import {Selectors} from "../../../data/dictionary";

export function constructVisibilityShedulerPopup(): HTMLDivElement {
  const popup = DOM.create_el({
    tag: "div",
    attributes: {
      id: Selectors.ZM_VISIBILITY_SHEDULER_POPUP.substring(1),
      class: '_3J6wB',
    },
  });

  return popup as HTMLDivElement;
}
