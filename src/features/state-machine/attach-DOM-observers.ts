import {DOM} from "../../../utility-belt/helpers/dom/DOM-shortcuts";
import {devprint} from "../../../utility-belt/helpers/debug/devprint";
import {get_extn_storage_item_value} from "../../../utility-belt/helpers/extn/storage";

import {Selectors, StateItemNames} from "../../data/dictionary";
import {TIME} from "../../../utility-belt/constants/time";

import {injectWAPageProvider} from "../../whatsapp/ExternalInjector";
import {toggle_contact_visibility_on_scroll} from "../../api/toggle-contact-visibility-on-scroll";
import {attach_hide_contact_item} from "../extension-can/display-zen-mode-ui/construct-zen-mode-ui/attach_hide_contact_item";
import {getHiddenChats} from "../../whatsapp/Storage";
import {setChatVisibility} from "../../api/set-chat-visibility";
import {checkZenMorningChatState} from "../user-can/zenmorning/setZenMorning";
import {Chat} from "../../whatsapp/model/Chat";
import {getSmartMuteStatus, setSmartMuteStatus} from "../user-can/SmartMute/SmartMute";
import {trackArchivedChatsVisibility} from "../../api/track-archived-chats-visibility";

// Attaches DOM observer and checks for tf conditions:
const observer = new MutationObserver(async (mutations) => {
  mutations.filter(m => m.type === 'attributes').forEach(mutation => {
    // 1. Contact els mutation on scroll.
    void toggle_contact_visibility_on_scroll(mutation);
  });

  mutations
    .filter(mutation => mutation.type !== 'attributes')
    .forEach(mutation => {
      [...mutation.addedNodes]
        .filter(node => node && node_is_Element(node))
        .forEach(async node => {
          // If WA contact context menu is present - Attach 'Hide contact' item.
          if (DOM.get_el(Selectors.WA_CONTACT_CTX_MENU) === node)
            attach_hide_contact_item(node as Element);

          // On page load - hides the contacts that were hidden by user previously.
          if (DOM.get_el(Selectors.WA_CONTACT_LIST, node as HTMLElement)) {
            injectWAPageProvider();

            const hiddenChats = await getHiddenChats();

            const zenMorningChat = (await get_extn_storage_item_value(
              StateItemNames.ZEN_MORNING_CHAT
            )) as Chat;

            const smartMuteStatus = await getSmartMuteStatus();

            // Explain: Wait for all rendering and animations to complete; otherwise - buggy.
            setTimeout(() => {
              hiddenChats.forEach((hiddenChat) => {
                setChatVisibility(hiddenChat, false, smartMuteStatus);
              });
              // Check smart mute
              setSmartMuteStatus(smartMuteStatus);
              // Open zen morning contact
              checkZenMorningChatState(zenMorningChat);
            }, TIME.ONE_SECOND);
          }

          const archivedMenuItem = DOM.get_el(Selectors.WA_GENERAL_CTX_MENU_ITEM_ARCHIVED, node as HTMLElement);
          if (archivedMenuItem) {
            trackArchivedChatsVisibility(archivedMenuItem);
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
