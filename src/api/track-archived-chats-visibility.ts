import {getHiddenChats} from "../whatsapp/Storage";
import {archiveChatLocally, unArchiveChatLocally} from "../whatsapp/ExtensionConnector";
import {Selectors} from "../data/dictionary";
import {process_error} from "../features/extension-can/process-errors/process-error";

export function trackArchivedChatsVisibility(menuEl: HTMLElement) {
  const archivedMenuItem = menuEl.children[0]?.children[3]?.children[0];
  if (!archivedMenuItem) {
    return process_error(new Error('Not archive menu item'));
  }
  const archivedItemOnClick = async () => {
    archivedMenuItem.removeEventListener('click', archivedItemOnClick); // Clear memory
    const hiddenChats = await getHiddenChats();
    hiddenChats.forEach(hiddenChat => {
      unArchiveChatLocally(hiddenChat);
    });
    setTimeout(() => {
      const buttonBack = document.querySelector(Selectors.WA_BACK_BTN);
      if (!buttonBack) {
        return process_error(new Error('The Back button is required' + buttonBack))
      }
      const backOnClick = () => {
        buttonBack.removeEventListener('click', backOnClick); // Clear memory
        hiddenChats.forEach(hiddenChat => {
          archiveChatLocally(hiddenChat);
        });
        const archivedChatsLeftBlock = buttonBack.closest(Selectors.WA_LEFT_CONTAINER);
        // @ts-ignore
        setTimeout(() => archivedChatsLeftBlock.style.setProperty('display', 'none'));
      };
      buttonBack.addEventListener('click', backOnClick, true);
    });
  };
  archivedMenuItem.addEventListener('click', archivedItemOnClick, true);
}
