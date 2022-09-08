import browser from "webextension-polyfill";
import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {set_el_style} from "../../../../utility-belt/helpers/dom/set-el-style";

import {Selectors} from "../../../data/dictionary";
import {lastHoveredChat} from "../../../features/extension-can/display-zen-mode-ui/construct-zen-mode-ui/attach_hide_contact_item";


export function constructBatchModePopupOff(): HTMLDivElement {
  const popup = DOM.create_el({
    tag: "div",
    attributes: {
      id: Selectors.ZM_BATCH_MODE_POPUP_OFF.substring(1),
      class: "_3J6wB",
    },
  });

  const title = DOM.create_el({
    tag: "h3",
    html: `${browser.i18n.getMessage(
      "ZM_batch_mode_title",
    )}`,
    attributes: {class: "ZenMode_batch_mode_title"},
  });

  const description = DOM.create_el({
    tag: "p",
    html: `${browser.i18n.getMessage(
      "ZM_batch_mode_description_off",
    )}`,
    attributes: {class: "ZenMode_batch_mode_description"},
  });

  const buttonBlock = DOM.create_el({
    tag: "div",
    attributes: {class: "ZenMode_batch_mode_button_block"},
  });

  const cancelButton = DOM.create_el({
    tag: "a",
    html: `${browser.i18n.getMessage(
      "ZM_batch_mode_button_no",
    )}`,
    attributes: {class: "ZenMode_batch_mode_cancel_button"},
  });

  const okButton = DOM.create_el({
    tag: "a",
    html: `${browser.i18n.getMessage(
      "ZM_batch_mode_button_yes",
    )}`,
    attributes: {class: "ZenMode_batch_mode_ok_button"},
  });

  buttonBlock.append(cancelButton, okButton);
  popup.append(title, description, buttonBlock);

  cancelButton.addEventListener("click", (e) =>
    set_el_style(DOM.get_el(Selectors.ZM_BATCH_MODE_POPUP_OFF), {display: "none"});
  );

  okButton.addEventListener("click", (e) =>
    removeChatInBatchMode(lastHoveredChat);
  );

  return popup as HTMLDivElement;
}

function removeChatInBatchMode(chat) {
  let chatsInBatchMode = JSON.parse (localStorage.getItem ("chatsInBatchMode"));
  chatsInBatchMode = chatsInBatchMode.filter((item) => item.id !== chat.id);
  localStorage.setItem ("chatsInBatchMode", JSON.stringify(chatsInBatchMode));

  set_el_style(DOM.get_el(Selectors.ZM_BATCH_MODE_POPUP_OFF), {display: "none"});
}
