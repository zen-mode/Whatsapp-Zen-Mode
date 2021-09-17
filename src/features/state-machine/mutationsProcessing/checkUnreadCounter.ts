import { Selectors, HideUnreadCountStatuses } from "../../../data/dictionary";
import { getHideUnreadCountStatus, getUnreadPopupWasShown, constructUnreadArchiveCountPopup } from "../../../whatsapp/ui/HideArchiveUnreadCount";

export async function checkUnreadCounter(htmlEl: HTMLElement) {
    if (htmlEl.classList.contains(Selectors.WA_ARCHIVE_UNREAD_COUNT.substring(1))) {
      const hiddeUnreadHiddenStatus = await getHideUnreadCountStatus();
      const unreadPopupWasShown = await getUnreadPopupWasShown();
      if (hiddeUnreadHiddenStatus === HideUnreadCountStatuses.DISABLED && !unreadPopupWasShown) {
        constructUnreadArchiveCountPopup(htmlEl);
      }
      if (hiddeUnreadHiddenStatus === HideUnreadCountStatuses.ENABLED) {
        htmlEl.style.visibility = "hidden";
      }
    }
  }