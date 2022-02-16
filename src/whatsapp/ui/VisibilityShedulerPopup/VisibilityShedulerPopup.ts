import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {set_el_style} from "../../../../utility-belt/helpers/dom/set-el-style";

import {Selectors} from "../../../data/dictionary";
import {VisibilitySheduleVariant} from "../../HiddenScheduler";

import "./TimeSelector";
import {construct_time_selector} from "./TimeSelector";

export function constructVisibilityShedulerPopup(): HTMLDivElement {
  const popup = DOM.create_el({
    tag: "div",
    attributes: {
      id: Selectors.ZM_VISIBILITY_SHEDULER_POPUP.substring(1),
      class: "_3J6wB",
    },
  });

  const description = DOM.create_el({
    tag: "div",
    html: "You'll only see this chat in the days/hours you choose. <br />(you can always access it via archived groups or Show Hidden Groups)",
  });

  popup.appendChild(description);
  popup.addEventListener("click", (e) => e.stopPropagation());

  const sheduleTypeSelector = DOM.create_el({
    tag: "select",
    attributes: {class: "ZenMode__select", id: "SheduleTypeSelector", value: "Custom"},
  });

  sheduleTypeSelector.onchange = function () {
    const value = (this as HTMLSelectElement).value;

    function onTimeSelectChange() {
        
    }

    switch (value) {
      case VisibilitySheduleVariant.Everyday:
        console.log("delete chat chedule");
        removeForms();
        break;
      case VisibilitySheduleVariant.Weekdays:
        removeForms();
        const weekdaysShedulerForm = DOM.create_el({
          tag: "div",
          attributes: {id: "WeekdaysShedulerForm"},
        });
        const fromTimeSelector = construct_time_selector({
          onChange: function () {
            console.log(this);
          },
          id: "fromTimeSelector",
        });
        const toTimeSelector = construct_time_selector({
          onChange: function () {
            console.log(this);
          },
          id: "toTimeSelector",
        });
        weekdaysShedulerForm.append(fromTimeSelector, toTimeSelector);

        popup.appendChild(weekdaysShedulerForm);
        break;
      case VisibilitySheduleVariant.Custom:
        removeForms();
        const customShedulerForm = DOM.create_el({
          tag: "div",
          attributes: {id: "CustomShedulerForm"},
        });

        const customShedulerOptions = Array(7).map((it, idx) =>
          construct_time_selector({
            onChange: function () {
              console.log((this as HTMLSelectElement).id);
            },
            id: `fromTimeSelector${}`,
          }),
        );

        popup.appendChild(customShedulerForm);
    }
  };

  const sheduleTypeSelectorOptions = [
    DOM.create_el({
      tag: "option",
      text: "Every day",
      attributes: {value: VisibilitySheduleVariant.Everyday},
    }),
    DOM.create_el({
      tag: "option",
      text: "Weekdays",
      attributes: {value: VisibilitySheduleVariant.Weekdays},
    }),
    DOM.create_el({
      tag: "option",
      text: "Custom",
      attributes: {value: VisibilitySheduleVariant.Custom},
    }),
  ];

  sheduleTypeSelectorOptions.forEach((option) => sheduleTypeSelector.appendChild(option));

  popup.appendChild(sheduleTypeSelector);

  const closeBtnEl = DOM.create_el({
    tag: "div",
    text: "x",
    attributes: {class: "hide-popup-close-btn"},
  });
  closeBtnEl.addEventListener("click", () => set_el_style(popup, {display: "none"}));
  popup.appendChild(closeBtnEl);

  window.addEventListener("click", (e) => {
    if ((e.target as Element).closest(Selectors.ZM_HIDE_POPUP)) {
      return;
    }
    set_el_style(popup, {display: "none"});
  });

  return popup as HTMLDivElement;
}

function removeForms() {
  DOM.remove_el("#WeekdaysShedulerForm");
  DOM.remove_el("#customShedulerForm");
}
