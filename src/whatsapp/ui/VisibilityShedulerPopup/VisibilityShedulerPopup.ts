import { DOM } from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import { set_el_style } from "../../../../utility-belt/helpers/dom/set-el-style";

import { Selectors } from "../../../data/dictionary";

export function constructVisibilityShedulerPopup(): HTMLDivElement {
  const popup = DOM.create_el({
    tag: "div",
    attributes: {
      id: Selectors.ZM_VISIBILITY_SHEDULER_POPUP.substring(1),
      class: '_3J6wB',
    },
  });

  const description = DOM.create_el({
    tag: "div",
    html: "You'll only see this chat in the days/hours you choose. <br />(you can always access it via archived groups or Show Hidden Groups)"
  });

  popup.appendChild(description);
  popup.addEventListener("click", (e) => e.stopPropagation());

  const sheduleTypeSelector = DOM.create_el({
    tag: "select",
    attributes: {class: "ZenMode__select", id: "SheduleTypeSelector", value: "Custom" }
  });

  sheduleTypeSelector.onchange = function (){
    console.log("onchange", (this as HTMLSelectElement).value);
  }


  const sheduleTypeSelectorOptions = [
    DOM.create_el({ tag: "option", text: "Every day", attributes: {value: "Every day"} }),
    DOM.create_el({ tag: "option", text: "Weekdays", attributes: {value: "Weekdays"} }),
    DOM.create_el({ tag: "option", text: "Custom", attributes: {value: "Custom"} }),
  ];

  sheduleTypeSelectorOptions.forEach((option) => sheduleTypeSelector.appendChild(option));

  // const onChange = () => {
  //   console.log("onChange");
  //   const selectElement = document.getElementById("SheduleTypeSelector") as HTMLSelectElement;
  //   if (selectElement) {
  //     console.log(selectElement.value);
  //   }

  // }

  // sheduleTypeSelector.addEventListener("onchange", () => onChange);

  popup.appendChild(sheduleTypeSelector);


  const closeBtnEl = DOM.create_el({
    tag: "div",
    text: "x",
    attributes: { class: "hide-popup-close-btn" },
  });
  closeBtnEl.addEventListener("click", () =>
    set_el_style(popup, { display: "none" }),
  );
  popup.appendChild(closeBtnEl);

  window.addEventListener('click', (e) => {
    if ((e.target as Element).closest(Selectors.ZM_HIDE_POPUP)) {
      return;
    }
    set_el_style(popup, { display: "none" });
  });

  return popup as HTMLDivElement;
}
