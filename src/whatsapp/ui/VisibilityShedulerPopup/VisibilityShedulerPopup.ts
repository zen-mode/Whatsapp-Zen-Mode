import browser from "webextension-polyfill";
import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {set_el_style} from "../../../../utility-belt/helpers/dom/set-el-style";

import {Selectors} from "../../../data/dictionary";
import {lastHoveredChat} from "../../../features/extension-can/display-zen-mode-ui/construct-zen-mode-ui/attach_hide_contact_item";
import {
  DayOfTheWeek,
  TimePeriod,
  VisibilitySheduleVariant,
  WeekShedule,
} from "../../VisibilitySheduler";

import "./TimeSelector";
import {construct_time_selector} from "./TimeSelector";

const daysLabels: Record<DayOfTheWeek, string> = {
  [DayOfTheWeek.SUN]: browser.i18n.getMessage("ZM_visibilty_sheduler_Sunday"),
  [DayOfTheWeek.MON]: browser.i18n.getMessage("ZM_visibilty_sheduler_Monday"),
  [DayOfTheWeek.TUE]: browser.i18n.getMessage("ZM_visibilty_sheduler_Tuesday"),
  [DayOfTheWeek.WED]: browser.i18n.getMessage("ZM_visibilty_sheduler_Wednesday"),
  [DayOfTheWeek.THU]: browser.i18n.getMessage("ZM_visibilty_sheduler_Thursday"),
  [DayOfTheWeek.FRI]: browser.i18n.getMessage("ZM_visibilty_sheduler_Friday"),
  [DayOfTheWeek.SAT]: browser.i18n.getMessage("ZM_visibilty_sheduler_Saturday"),
};

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
    html: `${browser.i18n.getMessage(
      "ZM_visibilty_sheduler_description",
    )}<br />${browser.i18n.getMessage("ZM_visibilty_sheduler_description1")}`,
    attributes: {class: "ZenMode_visibility-sheduler_description"},
  });

  const sheduleTitle = DOM.create_el({
    tag: "div",
    html: browser.i18n.getMessage("ZM_visibilty_sheduler_title"),
    attributes: {class: "ZenMode_visibility-sheduler_title"},
  });

  const customShedulerFormContainer = DOM.create_el({
    tag: "div",
  });

  const weekdaysDescriptionContainer = DOM.create_el({
    tag: "div",
  });

  popup.append(description, sheduleTitle);

  popup.addEventListener("click", (e) => e.stopPropagation());

  const sheduleTypeSelector = DOM.create_el({
    tag: "select",
    attributes: {class: "ZenMode__select", id: "SheduleTypeSelector", value: "Custom"},
  });

  const typeSelectorContainer = DOM.create_el({
    tag: "div",
    attributes: {class: "ZenMode__sheduler_row"},
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
    };
  };

  const onCustomToTimeSelectionChange = (day: string) => {
    return function () {
      const time = (this as HTMLSelectElement).value;
      shedule[day][1] = time;
    };
  };

  function onWeekdaysFromTimeSelector() {
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
          disableAboveSelected: false
        });
        const toTimeSelector = construct_time_selector({
          onChange: onWeekdaysToTimeSelector,
          id: "WeekdayToTimeSelector",
          disableAboveSelected: true
        });

        const separator = DOM.create_el({
          tag: "span",
          text: "-",
        });

        weekdaysShedulerForm.append(fromTimeSelector, separator, toTimeSelector);
        
        const description = DOM.create_el({
            tag: "span",
            attributes: {id: "WeekdaysDescription"},
            text: browser.i18n.getMessage("ZM_visibilty_sheduler_weekdays_description"),
          });

        weekdaysDescriptionContainer.append(description);

        typeSelectorContainer.append(weekdaysShedulerForm);
        break;

      case VisibilitySheduleVariant.Custom:
        removeForms();
        const customShedulerForm = DOM.create_el({
          tag: "div",
          attributes: {id: "CustomShedulerForm"},
        });

        const customShedulerOptions = [...Array(7)].map((_, day) => {
          const container = DOM.create_el({
            tag: "div",
            attributes: {class: "ZenMode__sheduler_row"},
          });

          const label = DOM.create_el({
            tag: "div",
            text: daysLabels[day],
            attributes: {class: "ZenMode__sheduler_weekday-label"},
          });

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

          container.append(label, fromTimeSelector, separator, toTimeSelector);
          return container;
        });
        customShedulerOptions.forEach((option) => {
          customShedulerForm.appendChild(option);
        });
        customShedulerFormContainer.appendChild(customShedulerForm);
    }
  };

  const sheduleTypeSelectorOptions = [
    DOM.create_el({
      tag: "option",
      text: browser.i18n.getMessage("ZM_visibilty_sheduler_All_the_time"),
      attributes: {value: VisibilitySheduleVariant.Everyday},
    }),
    DOM.create_el({
      tag: "option",
      text: browser.i18n.getMessage("ZM_visibilty_sheduler_weekdays"),
      attributes: {value: VisibilitySheduleVariant.Weekdays},
    }),
    DOM.create_el({
      tag: "option",
      text: browser.i18n.getMessage("ZM_visibilty_sheduler_custom"),
      attributes: {value: VisibilitySheduleVariant.Custom},
    }),
  ];

  sheduleTypeSelectorOptions.forEach((option) => sheduleTypeSelector.appendChild(option));

  typeSelectorContainer.appendChild(sheduleTypeSelector);
  popup.append(typeSelectorContainer, weekdaysDescriptionContainer, customShedulerFormContainer);

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
      class: "hide-popup-button ZenMode__sheduler_apply-button",
      type: "button",
    },
    text: browser.i18n.getMessage("ZM_visibilty_sheduler_confirmation_button_label"),
  });

  addSheduleButton.onclick = function (e: MouseEvent) {
    e.preventDefault();
    set_el_style(popup, {display: "none"});
    if (lastHoveredChat) {
      if (selectedSheduleVariant !== VisibilitySheduleVariant.Everyday) {
        browser.runtime.sendMessage({
          type: "setShedule",
          payload: {chat: lastHoveredChat, shedule},
        });
        return;
      }
      browser.runtime.sendMessage({
        type: "deleteShedule",
        payload: {chat: lastHoveredChat},
      });
    }
  };
  buttonsContainer.appendChild(addSheduleButton);

  popup.appendChild(buttonsContainer);

  return popup as HTMLDivElement;
}

function removeForms() {
  DOM.remove_el("#WeekdaysShedulerForm");
  DOM.remove_el("#CustomShedulerForm");
  DOM.remove_el("#WeekdaysDescription");
}
