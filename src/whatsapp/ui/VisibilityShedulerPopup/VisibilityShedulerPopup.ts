import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {set_el_style} from "../../../../utility-belt/helpers/dom/set-el-style";

import {Selectors} from "../../../data/dictionary";
import {DayOfTheWeek, VisibilitySheduleVariant, WeekShedule} from "../../HiddenScheduler";

import "./TimeSelector";
import {construct_time_selector} from "./TimeSelector";

export function constructVisibilityShedulerPopup(): HTMLDivElement {
  const shedule: WeekShedule = {
    [DayOfTheWeek.SUN]: undefined,
    [DayOfTheWeek.MON]: undefined,
    [DayOfTheWeek.TUE]: undefined,
    [DayOfTheWeek.WED]: undefined,
    [DayOfTheWeek.THU]: undefined,
    [DayOfTheWeek.FRI]: undefined,
    [DayOfTheWeek.SAT]: undefined,
  };
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

  const onFromTimeSelectionChange = (day: string) => {
    return function () {
      const time = (this as HTMLSelectElement).value;
      const toTimeSelector = DOM.get_el(`#CustomToTimeSelector${day}`)!;
      const timeSeparator = DOM.get_el(`#CustomTimeSeparator${day}`)!;
      if (time === "none") {
        toTimeSelector.style.visibility = "hidden";
        timeSeparator.style.visibility = "hidden";
        shedule[day] = undefined;
      } else {
        toTimeSelector.style.visibility = "visible";
        timeSeparator.style.visibility = "visible";
      }
      if (shedule[day]) {
        shedule[day][0] = time;
      } else {
        shedule[day] = [time, time + 30];
      }
      const fromSelectedIndex = (this as HTMLSelectElement).selectedIndex;
        const toSelectedIndex = (toTimeSelector as HTMLSelectElement).selectedIndex;
        (toTimeSelector as HTMLSelectElement).selectedIndex = Math.max(
          fromSelectedIndex,
          toSelectedIndex,
        );
        shedule[day][1] = (toTimeSelector as HTMLSelectElement).value;
        const toTimeOptions = (toTimeSelector as HTMLSelectElement).getElementsByTagName(
          "option",
        );
        for (let i = 0; i < toTimeOptions.length; i++) {
          if (i >= fromSelectedIndex) {
            toTimeOptions[i]!.disabled = false;
          } else {
            toTimeOptions[i]!.disabled = true;
          }
        }

      console.log(shedule);
    };
  };

  const onToTimeSelectionChange = (day: string) => () => {
    const time = (this as HTMLSelectElement).value;
    shedule[day][1] = time;
    console.log(shedule);
  };

  sheduleTypeSelector.onchange = function () {
    const value = (this as HTMLSelectElement).value;

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

        const customShedulerOptions = [...Array(7)].map((it, day) => {
          const container = DOM.create_el({tag: "div"});

          const fromTimeSelector = construct_time_selector({
            onChange: onFromTimeSelectionChange(day.toString()),
            includeNone: true,
          });
          const toTimeSelector = construct_time_selector({
            onChange: onToTimeSelectionChange(day.toString()),
            id: `CustomToTimeSelector${day}`,
          });
          toTimeSelector.style.visibility = "hidden";

          const separator = DOM.create_el({
            tag: "span",
            text: "-",
            attributes: {style: "visibility: hidden", id: `CustomTimeSeparator${day}`},
          });

          container.append(fromTimeSelector, separator, toTimeSelector);
          return container;
        });
        customShedulerOptions.forEach((option) => {
          customShedulerForm.appendChild(option);
        });
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
  DOM.remove_el("#CustomShedulerForm");
}
