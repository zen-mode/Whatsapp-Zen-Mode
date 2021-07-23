import {browser} from "webextension-polyfill-ts";
import {
  AutoReadHiddeConversationStatuses,
  CHECK_MARK_HTML,
  Selectors,
  StateItemNames,
} from "../../../data/dictionary";
import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {
  get_extn_storage_item_value,
  set_extn_storage_item,
} from "../../../../utility-belt/helpers/extn/storage";
import {set_el_attributes} from "../../../../utility-belt/helpers/dom/set-el-attributes";

export function construct_autoRead_hidden_conversations_menu_item(): HTMLElement {
  const text = browser.i18n.getMessage("ZM_ctxMenuItem_autoRead_hidden_conversations");
  const menuItem = document.createElement("DIV");

  set_el_attributes(menuItem, {
    id: Selectors.ZM_CTX_MENU_ITEM_AUTO_READ_HIDDEN_CONVERSATION.substring(1),
    class: "ZenMode__contextMenuItem__withIcon",
  });

  const textEl = DOM.create_el({
    tag: "span",
    attributes: {
      id: Selectors.ZM_AUTO_READ_HIDDEN_CONVERSATION_TEXT.substring(1),
    },
    text,
  });
  const checkMarkIconEl = DOM.create_el({
    tag: "i",
    attributes: {
      id: Selectors.ZM_AUTO_READ_HIDDEN_CONVERSATION_CHECK_MARK.substring(1),
    },
    html: "",
  });
  menuItem.append(textEl, checkMarkIconEl);

  return menuItem;
}

export async function toggleAutoReadHiddenConversations(): Promise<void> {
  const autoReadHiddenConversationsStatus = await getAutoReadHiddenConversationsStatus();
  if (autoReadHiddenConversationsStatus === AutoReadHiddeConversationStatuses.DISABLED) {
    await setAutoReadHiddenConversationsStatus(AutoReadHiddeConversationStatuses.ENABLED);
    return;
  }

  await setAutoReadHiddenConversationsStatus(AutoReadHiddeConversationStatuses.DISABLED);
}
export async function getAutoReadHiddenConversationsStatus(): Promise<AutoReadHiddeConversationStatuses> {
  const autoReadHiddenConversationsStatus = (await get_extn_storage_item_value(
    StateItemNames.AUTO_READ_HIDDEN_CONVERSATIONS_STATUS,
  )) as AutoReadHiddeConversationStatuses | undefined;
  if (autoReadHiddenConversationsStatus === undefined) {
    return AutoReadHiddeConversationStatuses.ENABLED;
  }
  return autoReadHiddenConversationsStatus;
}

export async function setAutoReadHiddenConversationsStatus(
  autoReadHiddenConversationsStatus: AutoReadHiddeConversationStatuses,
): Promise<void> {
  await set_extn_storage_item({
    [StateItemNames.AUTO_READ_HIDDEN_CONVERSATIONS_STATUS]:
      autoReadHiddenConversationsStatus,
  });

  const autoReadHiddenConversations = DOM.get_el(
    Selectors.ZM_CTX_MENU_ITEM_AUTO_READ_HIDDEN_CONVERSATION,
  );

  if (autoReadHiddenConversations) {
    const autoReadHiddenConversationsCheckMark = DOM.get_el(
      Selectors.ZM_AUTO_READ_HIDDEN_CONVERSATION_CHECK_MARK,
      autoReadHiddenConversations,
    );
    if (autoReadHiddenConversationsCheckMark) {
      autoReadHiddenConversationsCheckMark.innerHTML =
        autoReadHiddenConversationsStatus === AutoReadHiddeConversationStatuses.ENABLED
          ? CHECK_MARK_HTML
          : "";
    }
  }
}
