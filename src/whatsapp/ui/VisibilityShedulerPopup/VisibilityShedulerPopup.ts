import browser from "webextension-polyfill";
import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {set_el_style} from "../../../../utility-belt/helpers/dom/set-el-style";

import {Selectors} from "../../../data/dictionary";
import { lastHoveredChat } from "../../../features/extension-can/display-zen-mode-ui/construct-zen-mode-ui/attach_hide_contact_item";
import {
  DayOfTheWeek,
  TimePeriod,
  VisibilitySheduleVariant,
  WeekShedule,
} from "../../VisibilitySheduler";

import "./TimeSelector";
import {construct_time_selector} from "./TimeSelector";

export function constructVisibilityShedulerPopup(): HTMLDivElement {
  let shedule: WeekShedule = {
    [DayOfTheWeek.SUN]: undefined,
    [DayOfTheWeek.MON]: undefined,
    [DayOfTheWeek.TUE]: undefined,
    [DayOfTheWeek.WED]: undefined,
    [DayOfTheWeek.THU]: undefined,
    [DayOfTheWeek.FRI]: undefined,
    [DayOfTheWeek.SAT]: undefined,
  };

  let selectedSheduleVariant = VisibilitySheduleVariant.Everyday; 

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

  const typeSelectorContainer = DOM.create_el({
    tag: "div",
  });

  const onCustomFromTimeSelectionChange = (day: string) => {
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

  const onCustomToTimeSelectionChange = (day: string) => () => {
    const time = (this as HTMLSelectElement).value;
    shedule[day][1] = time;
    console.log(shedule);
  };

  function onWeekdaysFromTimeSelector() {
    debugger;
    const fromTime = Number((this as HTMLSelectElement).value);
    const toTimeSelector = DOM.get_el(`#WeekdayToTimeSelector`)!;

    const fromSelectedIndex = (this as HTMLSelectElement).selectedIndex;
    const toSelectedIndex = (toTimeSelector as HTMLSelectElement).selectedIndex;
    (toTimeSelector as HTMLSelectElement).selectedIndex = Math.max(
      fromSelectedIndex,
      toSelectedIndex,
    );

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
    const toTime = Number((toTimeSelector as HTMLSelectElement).value);
    const weekdayShedule: TimePeriod = [fromTime, toTime];

    shedule = {
      [DayOfTheWeek.SUN]: weekdayShedule,
      [DayOfTheWeek.MON]: weekdayShedule,
      [DayOfTheWeek.TUE]: weekdayShedule,
      [DayOfTheWeek.WED]: weekdayShedule,
      [DayOfTheWeek.THU]: weekdayShedule,
      [DayOfTheWeek.FRI]: undefined,
      [DayOfTheWeek.SAT]: undefined,
    };
    console.log(shedule);
  }

  function onWeekdaysToTimeSelector() {
    const toTime = Number((this as HTMLSelectElement).value);
    const fromTimeSelector = DOM.get_el(`#WeekdayFromTimeSelector`)!;
    const fromTime = Number((fromTimeSelector as HTMLSelectElement).value);
    const weekdayShedule: TimePeriod = [fromTime, toTime];
    shedule = {
      [DayOfTheWeek.SUN]: weekdayShedule,
      [DayOfTheWeek.MON]: weekdayShedule,
      [DayOfTheWeek.TUE]: weekdayShedule,
      [DayOfTheWeek.WED]: weekdayShedule,
      [DayOfTheWeek.THU]: weekdayShedule,
      [DayOfTheWeek.FRI]: undefined,
      [DayOfTheWeek.SAT]: undefined,
    };
    console.log(shedule);
  }

  sheduleTypeSelector.onchange = function () {
    const value = (this as HTMLSelectElement).value;
    selectedSheduleVariant = value as VisibilitySheduleVariant;
    switch (value) {
      case VisibilitySheduleVariant.Everyday:
        removeForms();
        break;
      case VisibilitySheduleVariant.Weekdays:
        removeForms();
        const weekdaysShedulerForm = DOM.create_el({
          tag: "div",
          attributes: {id: "WeekdaysShedulerForm"},
        });
        const fromTimeSelector = construct_time_selector({
          onChange: onWeekdaysFromTimeSelector,
          id: "WeekdayFromTimeSelector",
        });
        const toTimeSelector = construct_time_selector({
          onChange: onWeekdaysToTimeSelector,
          id: "WeekdayToTimeSelector",
        });
        weekdaysShedulerForm.append(fromTimeSelector, toTimeSelector);

        typeSelectorContainer.appendChild(weekdaysShedulerForm);
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
            onChange: onCustomFromTimeSelectionChange(day.toString()),
            includeNone: true,
          });
          const toTimeSelector = construct_time_selector({
            onChange: onCustomToTimeSelectionChange(day.toString()),
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

  typeSelectorContainer.appendChild(sheduleTypeSelector);
  popup.appendChild(typeSelectorContainer);

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

  const buttonsContainer = DOM.create_el({
    tag: "div",
    attributes: {
      class: "hide-popup-buttons-container",
    },
  });

  const addSheduleButton = DOM.create_el({
    tag: "div",
    attributes: {
      class: "hide-popup-button",
      type: "button",
    },
    text: browser.i18n.getMessage("WA_contactCtxMenuItem_hide"),
  });

  buttonsContainer.appendChild(addSheduleButton);

  addSheduleButton.onclick = function(e: MouseEvent) {
    e.preventDefault();
    if (lastHoveredChat) {
      if (selectedSheduleVariant !== VisibilitySheduleVariant.Everyday) {
        browser.runtime.sendMessage({type: 'setShedule', payload: {chat: lastHoveredChat, shedule}})
        return;
      }
      browser.runtime.sendMessage({type: 'deleteShedule', payload: {chat: lastHoveredChat}})
    }
  }

  popup.appendChild(buttonsContainer);

  return popup as HTMLDivElement;
}

function removeForms() {
  DOM.remove_el("#WeekdaysShedulerForm");
  DOM.remove_el("#CustomShedulerForm");
}
