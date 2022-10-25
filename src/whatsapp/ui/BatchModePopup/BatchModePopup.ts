import browser from "webextension-polyfill";
import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {set_el_style} from "../../../../utility-belt/helpers/dom/set-el-style";

import {Selectors} from "../../../data/dictionary";
import {lastHoveredChat} from "../../../features/extension-can/display-zen-mode-ui/construct-zen-mode-ui/attach_hide_contact_item";
import { hide_contact } from "../../../features/user-can/hide-contacts/hide-contact";
const default_time_to_hidden_Chat = 720;

export function constructBatchModePopup(): HTMLDivElement {
  const popup = DOM.create_el({
    tag: "div",
    attributes: {
      id: Selectors.ZM_BATCH_MODE_POPUP.substring(1),
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
      "ZM_batch_mode_description",
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
      "ZM_batch_mode_cancel_button",
    )}`,
    attributes: {class: "ZenMode_batch_mode_cancel_button"},
  });

  const okButton = DOM.create_el({
    tag: "a",
    html: `${browser.i18n.getMessage(
      "ZM_batch_mode_ok_button",
    )}`,
    attributes: {class: "ZenMode_batch_mode_ok_button"},
  });

  buttonBlock.append(cancelButton, okButton);
  popup.append(title, description, buttonBlock);

  cancelButton.addEventListener("click", (e) =>
    set_el_style(DOM.get_el(Selectors.ZM_BATCH_MODE_POPUP), {display: "none"});
  );

  okButton.addEventListener("click", (e) => {
    localStorage.setItem("chatInBatchModeChanged", "true")
    return addChatInBatchMode(lastHoveredChat);
  }
  );

  return popup as HTMLDivElement;
}

function addChatInBatchMode(chat) {
  if ( localStorage.getItem ("chatsInBatchMode") == null ) {
    let chatsInBatchMode = [];
    chat.timeToAddInBatchMode = new Date();
    chatsInBatchMode.push(chat);
    localStorage.setItem ("chatsInBatchMode", JSON.stringify(chatsInBatchMode));
  }else{
    let chatsInBatchMode = JSON.parse (localStorage.getItem ("chatsInBatchMode"));
    chat.timeToAddInBatchMode = new Date();
    chatsInBatchMode.push(chat);
    localStorage.setItem ("chatsInBatchMode", JSON.stringify(chatsInBatchMode));
  }


  //setListenerOpenChatInBatchMode()
  set_el_style(DOM.get_el(Selectors.ZM_BATCH_MODE_POPUP), {display: "none"});
}
