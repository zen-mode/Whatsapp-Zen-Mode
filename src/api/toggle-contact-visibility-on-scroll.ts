// Description:
// 1. Checks if the mutation was in a contact el.
// 2. Sets it's visibility css according to whether it is hidden by User or not.

import {DOM} from "../../utility-belt/helpers/dom/DOM-shortcuts";

import {Selectors} from "../data/dictionary";

import {get_chat_el_raw_title} from "./get-contact-el-name";
import {renderZenMorningSunIcon} from "./renderZenMorningSunIcon";
import {findChatByTitle} from "../whatsapp/ExtensionConnector";
import {isZenMorningChat} from "../features/user-can/zenmorning/setZenMorning";
import {isHiddenChat} from "../whatsapp/Storage";
import {renderHiddenLabel} from "../features/user-can/hide-contacts/hide-contact";

export function toggle_contact_visibility_on_scroll(
  mutation: MutationRecord,
): void {
  // 1. Checks if the mutation was in a contact el.
  const contactElDidntChangeCSS_translateParam = !mutation.oldValue?.includes(
    "translateY",
  );
  if (contactElDidntChangeCSS_translateParam)
    return;

  const chatEl = mutation.target as HTMLElement;
  if (!chatEl.classList.contains(Selectors.WA_CONTACT_WRAPPER.substring(1)) || !chatEl.closest(Selectors.WA_CONTACT_LIST)) return;

  // 2. Sets it's visibility css according to whether it is hidden by User or not.
  const chatElInfo = chatEl.querySelector(Selectors.WA_CONTACT_INFO_CONTAINER);
  if (!chatElInfo) return;
  const rawChatTitle = get_chat_el_raw_title(chatElInfo);

  findChatByTitle(rawChatTitle, async (chat) => {
    if (!chat) return;
    const isZenMorning = await isZenMorningChat(chat);
    renderZenMorningSunIcon(
      isZenMorning,
      chat,
      chatElInfo
    );
    if (await isHiddenChat(chat)) {
      renderHiddenLabel(chatElInfo as HTMLElement);
    }
  });
}
