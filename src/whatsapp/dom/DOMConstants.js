import {Selectors} from "../../data/dictionary";

/*
Main chat list
 */
export const CHAT_LIST_SELECTOR = Selectors.WA_CONTACT_LIST;

/*
Main Chat
 */
export const CHAT_NODE_TAG = 'div';
export const CHAT_NODE_CLASS = Selectors.WA_CONTACT_WRAPPER_CLASS;
export const CHAT_NODE_INFO_SELECTOR = '._3OvU8';
export const CHAT_NODE_AVA_CLASS = '_1lPgH';
export const CHAT_NODE_TITLE_SELECTOR = Selectors.WA_CONTACT_NAME;
export const CHAT_NODE_TITLE_ATTR = 'title';


/*
ZenMorning
 */
export const ZEN_MORNING_SUN_ID = Selectors.ZM_ZENMORNING_CONTACT_SUNICON.substring(1);

/*
Offline Mode
 */
export const ZM_CTX_MENU_ITEM_OFFLINE_MODE_ID = 'ZM_CTX_MENU_ITEM_OFFLINE_MODE_ID' 
export const ZM_CTX_MENU_ITEM_OFFLINE_MODE_TEXT_ID = 'ZM_CTX_MENU_ITEM_OFFLINE_MODE_TEXT_ID'
export const ZM_CTX_MENU_ITEM_OFFLINE_MODE_BUTTON_ID = 'ZenMode__contextMenuItem__offlineMode__switchIcon'
export const ZM_CTX_MENU_ITEM_OFFLINE_MODE_ICON_ID = 'ZenMode__offlineModeIcon'

/*
Pinned chats status
 */
export const ZM_CTX_MENU_ITEM_PINNED_STATUS_ID = 'ZM_CTX_MENU_ITEM_PINNED_STATUS_ID' 
export const ZM_CTX_MENU_ITEM_PINNED_STATUS_TEXT_ID = 'ZM_CTX_MENU_ITEM_PINNED_STATUS_TEXT_ID'
export const ZM_CTX_MENU_ITEM_PINNED_STATUS_BUTTON_ID = 'ZenMode__contextMenuItem__pinnedChatsStatus__switchIcon'