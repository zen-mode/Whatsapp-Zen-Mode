import browser from "webextension-polyfill";
import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";

export type ConstructTimeSelectorConfig = {
  onChange: (this: GlobalEventHandlers, ev: Event) => void;
  attributes?: Record<string, string>;
  id?: string;
  includeNone?: boolean;
  value?: number;
  disableAboveSelected?: boolean;
};

const TIME_INTERVAL = 30;
const DEFAULT_SELECTED_VALUE = 480;

export function construct_time_selector(config: ConstructTimeSelectorConfig) {
  const {onChange, id, includeNone, value = DEFAULT_SELECTED_VALUE, disableAboveSelected} = config;

  const defaultSelectedValue = includeNone ? undefined : value;

  let timeSelectorOptions = getTimeSelectorOptions(TIME_INTERVAL, defaultSelectedValue, disableAboveSelected);
  if (includeNone) {
    timeSelectorOptions = addNoneOption(timeSelectorOptions);
  }

  const attributes = {class: "ZenMode__select"};
  if (id) {
    attributes["id"] = id;
  }

  if (value) {
    attributes["value"] = value.toString();
  }

  const timeSelector = DOM.create_el({
    tag: "select",
    attributes,
  });

  timeSelector.onchange = onChange;

  timeSelectorOptions.forEach((option) => {
    timeSelector.appendChild(option);
  });

  return timeSelector;
}

function addNoneOption(options: HTMLElement[]) {
  const noneOption = DOM.create_el({
    tag: "option",
    attributes: {value: "none"},
    text: browser.i18n.getMessage("ZM_visibilty_sheduler_time_selector_none"),
  });
  return [noneOption, ...options];
}

function getTimeSelectorOptions(timeInterval: number, defaultSelected?: number, disableAboveSelected?: boolean) {
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

    const isDisabled = defaultSelected && disableAboveSelected && value < defaultSelected;

    const optionElement = DOM.create_el({
      tag: "option",
      attributes: {value: value.toString()},
      text: label,
    });

    if (defaultSelected === value) {
      optionElement.setAttribute("selected", "1");
    }

    if (isDisabled) {
      optionElement.setAttribute("disabled", "1");
    }
    return optionElement;
  });

  return timeOptions;
}
