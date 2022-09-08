import {DOM} from "../../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {throw_DOM_error} from "../../process-errors/process-error";
import {construct_Hide_contact_ctx_menu_item} from "./construct-hide-contact-item";
import {construct_Unhide_contact_ctx_menu_item} from "./construct-unhide-contact-item";
import {get_hovered_contact_raw_title} from "../../../user-can/hide-contacts/get-hovered-contact-name";

import {Selectors} from "../../../../data/dictionary";
import {findChatByTitle} from "../../../../whatsapp/ExtensionConnector";
import {Chat} from "../../../../whatsapp/model/Chat";
import {isHiddenChat, isMiniPreviewChat, getPinnedChatsStatus} from "../../../../whatsapp/Storage";
import { construct_visibilty_sheduler_ctx_menu_item } from "./construct-visibility-sheduler-item";
import { construct_mini_preview_ctx_menu_item } from "./construct-mini-preview-contact-item";
import { construct_batch_mode_ctx_menu_item} from "./construct-batch-mode-item";

export let lastHoveredChat: Chat | null;

export function setLastHoveredChat(chat:Chat) {
  lastHoveredChat = chat
}

export async function attach_hide_contact_item(node: HTMLElement): Promise<void> {
  // prettier-ignore
  // Explain: It shouldn't be a ZM element using WA styling; eg ZM_CTX_MENU or RN area .
  if ([
        Selectors.ZM_RELEASE_NOTES_AREA.substring(1),
        Selectors.ZM_CTX_MENU.substring(1),
      ].includes(node.id)
  ) return;

  const waContactCtxMenuEl = DOM.get_el(Selectors.WA_CONTACT_CTX_MENU);

  if (!waContactCtxMenuEl) {
    throw_DOM_error(Selectors.WA_CONTACT_CTX_MENU, "WA_CONTACT_CTX_MENU");
    return;
  }
  const waContactCtxMenuListEl = DOM.get_el("ul > div", waContactCtxMenuEl);
  if (!waContactCtxMenuListEl) {
    throw_DOM_error(Selectors.WA_CONTACT_CTX_MENU, "WA_CONTACT_CTX_MENU");
    return;
  }

  const hoveredContactTitle = get_hovered_contact_raw_title();

  findChatByTitle(hoveredContactTitle, async (hoveredChat) => {
    if (!hoveredChat) return;
    lastHoveredChat = hoveredChat;
    const isHidden = await isHiddenChat(hoveredChat);
    const menuItemEl = isHidden
      ? construct_Unhide_contact_ctx_menu_item()
      : construct_Hide_contact_ctx_menu_item();
    menuItemEl.classList.add('first');
    // const zenMorningItemEl = construct_zenMorning_contact_ctx_menu_item(
    //   await isZenMorningChat(hoveredChat)
    // );
    const visibilityShedulerItemEl = construct_visibilty_sheduler_ctx_menu_item();
    const batchModeItemEl = construct_batch_mode_ctx_menu_item(checkExistChatInBatchMode(lastHoveredChat));
    const status = await getPinnedChatsStatus();
    if (status) {
      const miniPreviewItemEl = construct_mini_preview_ctx_menu_item(await isMiniPreviewChat(hoveredChat))
      waContactCtxMenuListEl.append(menuItemEl, visibilityShedulerItemEl, miniPreviewItemEl, batchModeItemEl);
    } else {
      waContactCtxMenuListEl.append(menuItemEl, visibilityShedulerItemEl, batchModeItemEl);
    }
    waContactCtxMenuListEl.click(); // Corrects ctx menu visualization.
  });
}

function checkExistChatInBatchMode() {
	if ( localStorage.getItem ("chatsInBatchMode") == null ) {
		return false;
	}

	const chatsInBatchMode = JSON.parse (localStorage.getItem ("chatsInBatchMode"));

	if (chatsInBatchMode.find(chat => chat.id === lastHoveredChat.id) != null) {
		return true;
	}

	return false;
}
