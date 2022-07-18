// Description: Constructs the UI of the release notes widget

import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {set_el_style} from "../../../../utility-belt/helpers/dom/set-el-style";

import {Selectors} from "../../../data/dictionary";
// @ts-expect-error smth wrong with globals.d.ts.
import releaseNotes from "../../../../RELEASE-NOTES.yaml";
import {ReleaseNotes} from "../../../data/types";
import browser from "webextension-polyfill";

export function construct_mini_preview_popup(): HTMLDivElement {
  const miniPreviewAreaEl = DOM.create_el({
    tag: "div",
    attributes: {
      id: Selectors.ZM_MINI_PREVIEW_AREA.substring(1),
      class: '_3J6wB',
    },
  });

  const textDiv = DOM.create_el({
    tag: "div",
    attributes: {
      class: '_2Nr6U',
    },
    text: browser.i18n.getMessage("ZM_minipreview_popup_warning")
  });  

  const buttonDiv = DOM.create_el({
    tag: "div",
    attributes: {
      class: 'mini-preview-buttons-container',
    },
  });    

  const button = DOM.create_el({
    tag: "div",
    attributes: {
      class: 'mini-preview-buttons',
    },
    text: "Ok"
  });      
  buttonDiv.append(button);

  miniPreviewAreaEl.appendChild(textDiv);
  miniPreviewAreaEl.appendChild(buttonDiv);

  buttonDiv.addEventListener('click', (e) => {
    set_el_style(miniPreviewAreaEl, {display: "none"});
  });

  return miniPreviewAreaEl as HTMLDivElement;
}
