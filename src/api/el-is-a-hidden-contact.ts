import {get_extn_storage_item_value} from "../../utility-belt/helpers/extn/storage";
import {get_chat_el_raw_title} from "./get-contact-el-name";

import {StateItemNames} from "../data/dictionary";

import {Chat} from "../data/types";

export async function el_is_a_hidden_contact(el: Element): Promise<boolean> {
  const contactName = get_chat_el_raw_title(el);

  const hiddenContacts = (await get_extn_storage_item_value(
    StateItemNames.HIDDEN_CONTACTS,
  )) as Chat[];

  return hiddenContacts.some((hiddenContact) => hiddenContact.name === contactName);
}
