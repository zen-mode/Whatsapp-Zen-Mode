// Description:
// 1. Checks if the mutation was in a contact el.
// 2. Sets it's visibility css according to whether it is hidden by User or not.

import {DOM} from "../../utility-belt/helpers/dom/DOM-shortcuts";

import {Selectors} from "../data/dictionary";

import {get_chat_el_raw_title} from "./get-contact-el-name";
import {renderZenMorningSunIcon} from "./renderZenMorningSunIcon";
import {findChatByTitle} from "../whatsapp/ExtensionConnector";
import {Chat} from "../whatsapp/model/Chat";
import {isZenMorningChat} from "../features/user-can/zenmorning/setZenMorning";

export function toggle_contact_visibility_on_scroll(
  mutation: MutationRecord,
): void {
  // 1. Checks if the mutation was in a contact el.
  const contactElDidntChangeCSS_translateParam = !mutation.oldValue?.includes(
    "translateY",
  );
  if (contactElDidntChangeCSS_translateParam)
    return;

  const mutatedElIsNotInContactList = !DOM.get_el(Selectors.WA_CONTACT_LIST)?.contains(
    mutation.target,
  );
  if (mutatedElIsNotInContactList)
    return;

  // 2. Sets it's visibility css according to whether it is hidden by User or not.
  const chatEl = (mutation.target as Element).querySelector('.TbtXF');
  if (!chatEl)
    return
  const mutatedElChatTitle = get_chat_el_raw_title(chatEl);

  findChatByTitle(mutatedElChatTitle, async (chat: Chat) => {
    if (mutatedElChatTitle === get_chat_el_raw_title(chatEl)) {
      renderZenMorningSunIcon(
        await isZenMorningChat(chat),
        chat,
        chatEl
      );
    }
  });
}
