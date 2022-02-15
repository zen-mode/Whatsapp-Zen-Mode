import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {set_el_style} from "../../../../utility-belt/helpers/dom/set-el-style";

import {Selectors} from "../../../data/dictionary";
import {VisibilitySheduleVariant} from "../../HiddenScheduler";

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

  const fromTimeSelectorOptions = getTimeSelectorOptions(30);
  const toTimeSelectorOptions = getTimeSelectorOptions(30);

  sheduleTypeSelector.onchange = function () {
    const value = (this as HTMLSelectElement).value;

    switch (value) {
      case VisibilitySheduleVariant.Everyday:
        console.log("delete chat chedule");
        DOM.remove_el("#WeekdaysShedulerForm");
        break;
      case VisibilitySheduleVariant.Weekdays:
        // clear form
        const weekdaysShedulerForm = DOM.create_el({
          tag: "div",
          attributes: {id: "WeekdaysShedulerForm"},
        });
        const fromTimeSelector = DOM.create_el({
          tag: "select",
          attributes: {class: "ZenMode__select", id: "WeekdaysFromTimeSelector"},
        });

        const toTimeSelector = DOM.create_el({
          tag: "select",
          attributes: {class: "ZenMode__select", id: "WeekdaysToTimeSelector"},
        });
        fromTimeSelectorOptions.forEach((option) => {
          fromTimeSelector.appendChild(option);
        });

        toTimeSelectorOptions.forEach((option) => {
          toTimeSelector.appendChild(option);
        });
        weekdaysShedulerForm.append(fromTimeSelector, toTimeSelector);
        popup.appendChild(weekdaysShedulerForm);
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

function getTimeSelectorOptions(timeInterval: number) {
  let time = 0;
  const timeList = [];
  while (time < 24 * 60) {
    timeList.push(time);
    time += timeInterval;
  }

  const timeOptions = timeList.map((value) => {
    const hours24 = Math.floor(value / 60);
    const minutes = value % 60;
    const minutesString = minutes < 10 ? `0${minutes}` : minutes;
    const timePostfix = hours24 < 12 ? "AM" : "PM";
    const hours12 = hours24 % 12 || 12;

    const label = `${hours12}:${minutesString} ${timePostfix}`;
    return DOM.create_el({
      tag: "option",
      attributes: {value: value.toString()},
      text: label,
    });
  });

  return timeOptions;
}
