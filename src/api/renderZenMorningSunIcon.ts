import {Selectors} from "../data/dictionary";
import {isZenMorningChat} from "../features/user-can/zenmorning/setZenMorning";
import {DOM} from "../../utility-belt/helpers/dom/DOM-shortcuts";
import {get_contact_el_by_chat_name} from "./get-contact-el-by-contact-name";
import {Chat} from "../whatsapp/model/Chat";
import {process_error} from "../features/extension-can/process-errors/process-error";

export function renderZenMorningSunIcon(isZenMorning: boolean, chat: Chat, chatEl?: Element | null): void {
  chatEl = chatEl || get_contact_el_by_chat_name(chat.title);
  if (!chatEl) {
    process_error(new Error(`chatEl not found for ${JSON.stringify(chat)}`));
    return;
  }
  const sunIcon = chatEl.querySelector(Selectors.ZM_ZENMORNING_CONTACT_SUNICON);
  if (sunIcon) {
    if (!isZenMorning) {
      sunIcon.remove();
    }
  } else if (isZenMorning) {
    const div = DOM.create_el({
      tag: 'div',
      attributes: {
        id: Selectors.ZM_ZENMORNING_CONTACT_SUNICON.substring(1)
      },
      html: `\uD83C\uDF1E`
    });
    chatEl.append(div);
  }
}
