import {createPopper, Instance, Modifier} from "@popperjs/core";
// import {TIME} from "../../../utility-belt/constants/time";
// import {
//   get_extn_storage_item_value,
//   set_extn_storage_item,
// } from "../../../utility-belt/helpers/extn/storage";
import {
  CHECK_MARK_HTML,
  HideUnreadCountStatuses,
  Selectors,
  StateItemNames,
} from "../../data/dictionary";
import browser from "webextension-polyfill";
import {set_el_attributes} from "../../../utility-belt/helpers/dom/set-el-attributes";
import {DOM} from "../../../utility-belt/helpers/dom/DOM-shortcuts";
import {
  get_extn_storage_item_value,
  set_extn_storage_item,
} from "../../../utility-belt/helpers/extn/storage";

export function construct_hide_unread_count_menu_item(): HTMLElement {
  const text = browser.i18n.getMessage("ZM_ctxMenuItem_hide_archived_count_menu_label");
  const menuItem = document.createElement("DIV");

  set_el_attributes(menuItem, {
    id: Selectors.ZM_CTX_MENU_ITEM_HIDE_UNREAD_COUNT.substring(1),
    class: "ZenMode__contextMenuItem__withIcon",
  });

  const textEl = DOM.create_el({
    tag: "span",
    attributes: {
      id: Selectors.ZM_CTX_MENU_ITEM_HIDE_UNREAD_COUNT_TEXT.substring(1),
    },
    text,
  });
  const checkMarkIconEl = DOM.create_el({
    tag: "i",
    attributes: {
      id: Selectors.ZM_CTX_MENU_ITEM_HIDE_UNREAD_COUNT_ICON.substring(1),
    },
    html: "",
  });
  menuItem.append(textEl, checkMarkIconEl);

  return menuItem;
}

export function constructUnreadArchiveCountPopup(refElement: HTMLElement) {
  let popperInstance: Instance | null = null;
  const popper = document.createElement("div");
  popper.setAttribute("id", `unreadCounterPopup`);
  popper.className = "unread-archive-count-popup";

  const popperContent = document.createElement("div");
  popperContent.innerHTML = `${browser.i18n.getMessage(
    "ZM_unread_archive_count_popup_text1",
  )}.<br />${browser.i18n.getMessage("ZM_unread_archive_count_popup_text2")}`;
  popper.appendChild(popperContent);

  const popperButton = document.createElement("button");
  popperButton.textContent = browser.i18n.getMessage("ZM_unread_archive_count_popup_button_label");

  const closePopper = async () => {
    if (refElement) {
      refElement.style.transition = "opacity 0.5s linear";
      await setHideUnreadCountStatus(HideUnreadCountStatuses.ENABLED);
      await setUnreadPopupWasShown();

      document.body.removeChild(popper);
      document.body.removeChild(overlay);
      if (popperInstance) {
        popperInstance.destroy();
      }
    }
  };

  popperButton.onclick = closePopper;

  popper.appendChild(popperButton);

  const overlay = document.createElement("div");
  overlay.className = "unread-archive-count-popup-overlay";
  overlay.onclick = closePopper;

  document.body.appendChild(overlay);
  document.body.appendChild(popper);

  popperInstance = createPopper(refElement, popper, {
    placement: "right",
  });
}

export async function toggleHideUnreadCount(): Promise<void> {
  const autoReadHiddenConversationsStatus = await getHideUnreadCountStatus();
  if (autoReadHiddenConversationsStatus === HideUnreadCountStatuses.DISABLED) {
    await setHideUnreadCountStatus(HideUnreadCountStatuses.ENABLED);
    return;
  }

  await setHideUnreadCountStatus(HideUnreadCountStatuses.DISABLED);
}

export async function getHideUnreadCountStatus(): Promise<HideUnreadCountStatuses> {
  const autoReadHiddenConversationsStatus = (await get_extn_storage_item_value(
    StateItemNames.HIDE_ARCHIVE_UNREAD_COUNT,
  )) as HideUnreadCountStatuses | undefined;
  if (autoReadHiddenConversationsStatus === undefined) {
    return HideUnreadCountStatuses.DISABLED;
  }
  return autoReadHiddenConversationsStatus;
}

export async function setUnreadPopupWasShown() {
  await set_extn_storage_item({
    [StateItemNames.UNREAD_COUNT_POPUP_WAS_SHOWN]: true,
  });
}

export async function getUnreadPopupWasShown() {
  return await get_extn_storage_item_value(StateItemNames.UNREAD_COUNT_POPUP_WAS_SHOWN);
}

export async function setHideUnreadCountStatus(
  hideUnreadCountStatus: HideUnreadCountStatuses,
): Promise<void> {
  await set_extn_storage_item({
    [StateItemNames.HIDE_ARCHIVE_UNREAD_COUNT]: hideUnreadCountStatus,
  });

  const hideUnreadCountMenuItemElement = DOM.get_el(
    Selectors.ZM_CTX_MENU_ITEM_HIDE_UNREAD_COUNT,
  );

  const unreadCountElement = DOM.get_el(Selectors.WA_ARCHIVE_UNREAD_COUNT);

  if (unreadCountElement) {
    unreadCountElement.style.opacity =
      hideUnreadCountStatus === HideUnreadCountStatuses.ENABLED ? "0" : "1";
  }

  if (hideUnreadCountMenuItemElement) {
    const autoReadHiddenConversationsCheckMark = DOM.get_el(
      Selectors.ZM_CTX_MENU_ITEM_HIDE_UNREAD_COUNT_ICON,
      hideUnreadCountMenuItemElement,
    );
    if (autoReadHiddenConversationsCheckMark) {
      autoReadHiddenConversationsCheckMark.innerHTML =
        hideUnreadCountStatus === HideUnreadCountStatuses.ENABLED ? CHECK_MARK_HTML : "";
    }
  }
}
