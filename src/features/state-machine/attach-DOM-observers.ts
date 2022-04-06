import {DOM} from "../../../utility-belt/helpers/dom/DOM-shortcuts";
import {devprint} from "../../../utility-belt/helpers/debug/devprint";

import {Selectors} from "../../data/dictionary";
import {TIME} from "../../../utility-belt/constants/time";

import {injectWAPageProvider} from "../../whatsapp/ExternalInjector";
import {attach_hide_contact_item} from "../extension-can/display-zen-mode-ui/construct-zen-mode-ui/attach_hide_contact_item";
import {getHiddenChats, isHiddenChat} from "../../whatsapp/Storage";
import {setChatVisibility} from "../../api/set-chat-visibility";
import {checkZenMorningChatState, getZenMorningChat} from "../user-can/zenmorning/setZenMorning";
import {getSmartMuteStatus, setSmartMuteStatus} from "../user-can/SmartMute/SmartMute";
import {trackArchivedChatsVisibility} from "../../api/track-archived-chats-visibility";
import {attachUIToMainContactCtxMenu} from "../extension-can/display-zen-mode-ui/construct-zen-mode-ui/attachUIToMainContactCtxMenu";
import {get_Zen_mode_status, toggle_Zen_mode_on_page} from "../user-can/toggle-zen-mode/cs/toggle-zen-mode";
import {renderHiddenLabel} from "../user-can/hide-contacts/hide-contact";
import {get_chat_el_raw_title} from "../../api/get-contact-el-name";
import {findChatByTitle} from "../../whatsapp/ExtensionConnector";
import {get_contact_el_by_chat_name} from "../../api/get-contact-el-by-contact-name";
import { fixContextMenuPosition } from "../../whatsapp/ui/FakeCtxMenu/utils";
import { get_hovered_contact_el } from "../../api/get-hovered-contact-el";
import { getDebugModeStatus, setDebugModeStatus } from "../../whatsapp/ui/MenuItems/debugMode";

const CONTACT_CONTEXT_MENU_CUSTOM_ITEMS_COUNT = 3;
const CHAT_CONTEXT_MENU_CUSTOM_ITEMS_COUNT = 1;

export let providerInjected = false;
// Attaches DOM observer and checks for tf conditions:
const observer = new MutationObserver(async (mutations) => {
  mutations
    .filter(mutation => mutation.type !== 'attributes')
    .forEach(mutation => {
      [...mutation.addedNodes]
        .filter(node => node && node_is_Element(node))
        .forEach(async node => {
          const htmlEl = node as HTMLElement;
          // If WA contact context menu is present - Attach 'Hide contact' item.
          if (DOM.get_el(Selectors.WA_CONTACT_CTX_MENU) === htmlEl) {
            // Explain: If there is no hovered el in the DOM - it means the WA ctx menu has been..
            // invoked from chat area, not contact list area.
              const hoveredDivEl = get_hovered_contact_el();
            
              if (hoveredDivEl) {
                attach_hide_contact_item(htmlEl);
              } else {
                attachUIToMainContactCtxMenu(htmlEl);
              }

              const customMenuItemsCount = hoveredDivEl ? CONTACT_CONTEXT_MENU_CUSTOM_ITEMS_COUNT : CHAT_CONTEXT_MENU_CUSTOM_ITEMS_COUNT;
              fixContextMenuPosition(htmlEl, customMenuItemsCount);
          }

          // On page load - hides the contacts that were hidden by user previously.
          if (DOM.get_el(Selectors.WA_CONTACT_LIST, htmlEl)) {
            if (!providerInjected) {
              injectWAPageProvider();
              providerInjected = true;
            }

            const zenModeStatus = await get_Zen_mode_status();

            const hiddenChats = await getHiddenChats();

            const zenMorningChat = await getZenMorningChat();

            const smartMuteStatus = await getSmartMuteStatus();

            const debugModeStatus = await getDebugModeStatus();


            // Explain: Wait for all rendering and animations to complete; otherwise - buggy.
            setTimeout(() => {
              // Zen mode activation
              toggle_Zen_mode_on_page(zenModeStatus);
              // Hidden chats
              hiddenChats.forEach(hiddenChat => {
                setChatVisibility(hiddenChat, false, smartMuteStatus);
                const chatEl = get_contact_el_by_chat_name(hiddenChat.title);
                if (!chatEl) return;
                renderHiddenLabel(chatEl);
              });
              // Check smart mute
              setSmartMuteStatus(smartMuteStatus);

              setDebugModeStatus(debugModeStatus);
              // Open zen morning contact
              checkZenMorningChatState(zenMorningChat);
            }, TIME.ONE_SECOND);
          }

          const menuEl = htmlEl.closest(Selectors.WA_GENERAL_CTX_MENU);
          if (menuEl) {
            trackArchivedChatsVisibility(menuEl as HTMLElement);
          }

          if (htmlEl.classList.contains(Selectors.WA_CONTACT_CONTAINER.substring(1))) {
            const chatElInfo = htmlEl.querySelector(Selectors.WA_CONTACT_INFO_CONTAINER);
            if (chatElInfo) {
              const rawChatTitle = get_chat_el_raw_title(chatElInfo);
              findChatByTitle(rawChatTitle, async chat => {
                if (!chat || !(await isHiddenChat(chat))) return;
                renderHiddenLabel(chatElInfo as HTMLElement);
              });
            }
          }
        });
    });
});

observer.observe(document.body, {
  attributes: true,
  attributeFilter: ["style"],
  attributeOldValue: true,
  childList: true,
  subtree: true,
});

devprint("STATUS: DOM observers attached.");

function node_is_Element(node: Node): node is Element {
  return node instanceof Element;
}
