// Description: Constructs the UI of the release notes widget

import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {set_el_style} from "../../../../utility-belt/helpers/dom/set-el-style";

import {Selectors} from "../../../data/dictionary";
import browser from "webextension-polyfill";
import { hide_contact } from "../hide-contacts/hide-contact";

export function construct_hide_popup_area(): HTMLDivElement {
  const hidePopupArea = DOM.create_el({
    tag: "div",
    attributes: {
      id: Selectors.ZM_HIDE_POPUP.substring(1),
      class: '_3J6wB',
    },
  });

  const headerEl = DOM.create_el({
    tag: "h1",
    text: `${browser.i18n.getMessage("ZM_hide_popup_title")}`
  });
  hidePopupArea.appendChild(headerEl);

  const hidePopupFormEl = DOM.create_el({tag: "form"});
  hidePopupArea.appendChild(hidePopupFormEl);

  const hidePopupGroupHours = DOM.create_el({tag: "label", attributes: {
    class: 'hide-popup-group',
  }});
  hidePopupGroupHours.appendChild(DOM.create_el({ attributes: {type: 'radio', value: "hours", name: "hideRadio", class: "hide-popup-radio"}, tag: "input"}))
  hidePopupGroupHours.appendChild(DOM.create_el({text: browser.i18n.getMessage("ZM_hide_popup_hours"), tag: "span"}))
  hidePopupFormEl.appendChild(hidePopupGroupHours)

  const hidePopupGroupWeek = DOM.create_el({tag: "label", attributes: {
    class: 'hide-popup-group'
  }});
  hidePopupGroupWeek.appendChild(DOM.create_el({ attributes: {type: 'radio', value: "week", name: "hideRadio", class: "hide-popup-radio"}, tag: "input"}))
  hidePopupGroupWeek.appendChild(DOM.create_el({text: browser.i18n.getMessage("ZM_hide_popup_week"), tag: 'span'}))
  hidePopupFormEl.appendChild(hidePopupGroupWeek)

  const hidePopupGroupForever = DOM.create_el({tag: "label", attributes: {
    class: 'hide-popup-group'
  }});
  hidePopupGroupForever.appendChild(DOM.create_el({ attributes: {type: 'radio', value: "forever",  name: "hideRadio", class: "hide-popup-radio"}, tag: "input"}))
  hidePopupGroupForever.appendChild(DOM.create_el({text: browser.i18n.getMessage("ZM_hide_popup_forever"),  tag: 'span'}))
  hidePopupFormEl.appendChild(hidePopupGroupForever)

  const hidePopupButton = DOM.create_el({tag: "div", attributes: {
    class: 'hide-popup-button',
    type: "button"
  },text: browser.i18n.getMessage("WA_contactCtxMenuItem_hide")})
  hidePopupButton.onclick = function(e: MouseEvent) {
      e.preventDefault();
      const elems = DOM.get_input_els(".hide-popup-radio");
      let selectedValue;
      if (elems && elems.length) {
        elems.forEach((item) => {
          if (item.checked) {
            selectedValue = item.value;
          }
        })
      }
      if (selectedValue === "hours") {
        hide_contact(480)
        set_el_style(hidePopupArea, {display: "none"});
      } else if (selectedValue === "week") {
        hide_contact(10080)
        set_el_style(hidePopupArea, {display: "none"});
      } else if (selectedValue === "forever") {
        hide_contact()
        set_el_style(hidePopupArea, {display: "none"});
      }
  }
  hidePopupFormEl.appendChild(hidePopupButton)

  const closeBtnEl = DOM.create_el({
    tag: "div",
    text: "x",
    attributes: {id: Selectors.ZM_RELEASE_NOTES_AREA_CLOSE_BTN.substring(1)},
  });
  closeBtnEl.addEventListener("click", () =>
    set_el_style(hidePopupArea, {display: "none"}),
  );
  hidePopupArea.appendChild(closeBtnEl);

  window.addEventListener('click', (e) => {
    if ((e.target as Element).closest(Selectors.ZM_HIDE_POPUP)) {
      return;
    }
    set_el_style(hidePopupArea, {display: "none"});
  });

  return hidePopupArea as HTMLDivElement;
}
