// Description: Constructs the UI of the release notes widget

import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";

import {Selectors} from "../../../data/dictionary";
import browser from "webextension-polyfill";

export function construct_zenmorning_area(): HTMLDivElement {
  const areaEl = DOM.create_el({
    tag: "div",
    attributes: {
      id: Selectors.ZM_ZENMORNING_AREA.substring(1),
      class: '_3J6wB',
    },
  });

  const headerEl = DOM.create_el({
    tag: "h1",
    text: browser.i18n.getMessage("WA_contactCtxMenuItem_zenMorning")
  });
  areaEl.appendChild(headerEl);

  const zenMorningDescEl = DOM.create_el({
    tag: "p",
    text: browser.i18n.getMessage("ZM_zenMorning_description")
  });
  areaEl.appendChild(zenMorningDescEl);

  const footerEl = DOM.create_el({
    tag: "ul",
    attributes: {
      id: Selectors.ZM_ZENMORNING_AREA_FOOTER.substring(1)
    }
  });
  ['cancel', 'ok'].forEach(action => {
    let text = '';

    switch (action) {
      case 'cancel': {
        text = browser.i18n.getMessage('ZM_noBtn');
      }
      break;

      case 'ok': {
        text = browser.i18n.getMessage('ZM_yesBtn');
      }
    }

    const btn = DOM.create_el({
      tag: 'button',
      attributes: {
        'data-action': action
      },
      text
    });

    footerEl.append(btn);
  });
  areaEl.append(footerEl);

  return areaEl as HTMLDivElement;
}
