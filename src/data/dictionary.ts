// export const enum Config {
//   VER_NUMBER = "1.2.1",
// }

export const URLS = {
  FEEDBACK_EMAIL: "mailto:usezenmode@gmail.com",
  INTRO_PAGE: "https://google.com",
  PROXY: "https://cors-anywhere.herokuapp.com:443/",
} as const;

export const enum Commands {
  TOGGLE_ZEN_MODE = "TOGGLE_ZEN_MODE",
  CHECK_ZENMORNING = "CHECK_ZENMORNING"
}

// export const enum Messages {
//   COLLECTED_LINKS = "COLLECTED_LINKS",
// }
//

export const enum StateItemNames {
  HIDDEN_CONTACTS = "HIDDEN_CONTACTS",
	ZEN_MORNING_CHAT = "ZEN_MORNING_CHAT",
  RELEASE_NOTES_VIEWED = "RELEASE_NOTES_VIEWED",
  ZEN_MODE_STATUS = "ZEN_MODE_STATUS",
  ZEN_MODE_CHAT = "ZEN_MODE_CHAT",
  LAST_ACTIVITY_DATE = "LAST_ACTIVITY_DATE",
  ZEN_MODE_FORCE_BY_ZEN_MORNING = "ZEN_MODE_FORCE_BY_ZEN_MORNING",
  SMART_MUTE_STATUS = "SMART_MUTE_STATUS",
  AUTO_READ_HIDDEN_CONVERSATIONS_STATUS = "AUTO_READ_HIDDEN_CONVERSATIONS_STATUS",
  SETTINGS_MENU = "SETTINGS_MENU",
  SCHEDULED_HIDDEN = 'SCHEDULED_HIDDEN',
  DEBUG_MODE_STATUS = "DEBUG_MODE_STATUS",
  PINNED_CHATS_STATUS_ENABLED = "PINNED_CHATS_STATUS_ENABLED",
  WAS_SHOWN_PINNED_CHATS_STATUS_ONBOARDING = "WAS_SHOWN_PINNED_CHATS_STATUS_ONBOARDING",
}

export const enum Selectors {
  // Note: there are 2 regions; we need the 1st.
  WA_CONTACT_LIST = "#pane-side [role=grid]",
  // Attention: Non-exclusive! Other unrelated els have this too.
  WA_CONTACT_NAME = "span.ggj6brxn[title]",
  WA_CONTACT_SECOND_DIV = "[role='gridcell']",
  WA_CONTACT_ELEMENT_HOVERED_DIV = '.vq6sj:hover',
  WA_CONTACT_ICON_CLASS_NAME = "_2TiQe",
  WA_CONTACT_UNREAD_SPAN = "._38M1B",

  WA_TARGETED_CHAT_TITLE = "#main > header span[title]",

  // Explain: WA ctx menu get rendered to dom only on RMB click. Since we need to use it's ..
  // class to style our own ctx menu - we have to hard code the name of the class.
  // WA_CONTACT_CTX_MENU = "#app span:nth-of-type(4) > div",
  // WA_CONTACT_CTX_MENU_LIST = "#app span:nth-of-type(4) > div ul",
  // WA_CONTACT_CTX_MENU_LIST_ITEM = "#app span:nth-of-type(4) > div ul li",
  // WA_CONTACT_CTX_MENU_ITEM_CONTENTS_DIV = "#app span:nth-of-type(4) > div ul [role='button']",
  WA_BACK_BTN = "._27F2N [data-testid=back]",

  WA_CONTACT_WRAPPER_CLASS = "vq6sj",
  WA_CONTACT_CONTAINER = "._ccCW", // .FqYAR.i0jNr
  WA_CONTACT_INFO_CONTAINER = "._3vPI2",
  WA_CONTACT_CTX_MENU = "#app > div > span > .o--vV",
  WA_CONTACT_CTX_MENU_LIST = "._19rjv",
  WA_GENERAL_CTX_MENU = "._1R3Un ._1qAEq._11bi2",
  WA_LEFT_CONTAINER = "._1sMV6",
  WA_LEFT_HEADER_BUTTONS = "._3UaCz > span",
  // Explain: Looks like it's not needed.
  WA_CONTACT_CTX_MENU_ITEM_CONTENTS_DIV = "._11srW, ._2xxet",
  WA_HIDDEN_LABEL_CONTAINER = "._1SjZ2 ._2TiQe._2SDbp",

  WA_CONTACT_INFO_PANEL = "#app > div > div > div:nth-of-type(2) > div:nth-of-type(1)",
  WA_SIDEBAR = "#side",
  WA_USER_NAVBAR = "#main header",
  ZM_CTX_MENU = "#ZenMode__contextMenu",
  ZM_CTX_MENU_ITEM = ".ZenMode__contextMenuItem",
  ZM_HIDE_CONTACT_CTX_MENU_ITEM = "#ZenMode__hideContact",
  ZM_UNHIDE_CONTACT_CTX_MENU_ITEM = "#ZenMode__unhideContact",
	ZM_ZENMORNING_CONTACT_CTX_MENU_ITEM = "#ZenMode__zenMorning",
  ZM_VISIBILITY_SHEDULER_CTX_MENU_ITEM = "#ZenMode__visibilitySheduler",
  ZM_ZENMORNING_CONTACT_SUNICON = "#ZenMode__zenMorning__sunIcon",
  ZM_ZENMORNING_AREA = "#ZenMode__zenMorningArea",
  ZM_ZENMORNING_AREA_FOOTER = "#ZenMode__zenMorningArea__footer",
  ZM_RELEASE_NOTES_AREA = "#ZenMode__releaseNotes",
  ZM_RELEASE_NOTES_AREA_CLOSE_BTN = "#ZenMode__releaseNotes__closeBtn",
  ZM_RELEASE_NOTES_AREA_VERSION = "#ZenMode__releaseNotes__version",
  ZM_CTX_MENU_ITEM_SMARTMUTE = "#ZenMode__contextMenuItem__smartMute",
  ZM_SMARTMUTE_SOUNDICON = "#ZenMode__smartMute__soundIcon",
  ZM_SMARTMUTE_TEXT = "#ZenMode__smartMute__text",

  ZM_CTX_MENU_ITEM_DEBUG_MODE = "#ZenMode__contextMenuItem__debugMode",
  ZM_CTX_MENU_ITEM_DEBUG_TEXT = "#ZenMode__contextMenuItem__debugMode__text",
  ZM_CTX_MENU_ITEM_DEBUG_SWITCH_ICON = "#ZenMode__contextMenuItem__debugMode__switchIcon",

  ZM_DEBUG_MODE_INDICATOR = "#ZenMode__debugModeIndidcator",

  
  ZM_TOGGLE_BUTTON = "#ZenMode__toggle",
  ZM_TOGGLE_BUTTON_CHEVRON = "#ZenMode__toggle__chevron",
  ZM_BADGE = "#ZenMode__badge",
  ZM_TRELLO_LIST_CONTENT = "js-list-content",
  ZM_HIDE_POPUP = "#ZenMode_hide_popup",
  ZM_VISIBILITY_SHEDULER_POPUP = "#ZenMode__visibilityShedulerPopup",
  ZM_TRELLO_POP_OVER = "div.pop-over",
  ZM_TRELLO_POP_OVER_CONTENT = "div.pop-over-content",
  ZM_TRELLO_POP_OVER_LIST = "pop-over-list",
  ZM_TRELLO_WINDOW_OVERLAY = "div.window-overlay",
  ZM_TRELLO_LIST_HEADER = "list-header-extras",
  ZM_TRELLO_CLOSE_POP_OVER_BTN = "a.pop-over-header-close-btn"
}

export const enum ZenDomDataAttributes {
  "chat-id" = "zm-data-chat-id",
}

export const enum ZenModeStatuses {
  ON = "ON",
  OFF = "OFF",
}

//
// export const ERROR = "ERROR";
//
// export const enum ErrorCodes {
//   FATAL = 100,
//   NON_FATAL = 150,
//   TAB_CLOSED = 200,
//   AUTH = 300,
//   NOT_FOUND = 404,
//   SERVER = 500,
// }
//
// export const enum MessageTypes {
//   AUTH_ERROR = "AUTH_ERROR",
//   FATAL_ERROR = "FATAL_ERROR",
// }

export const ZEN_MORNING_HOUR = 4;
export const SOUND_OFF_HTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 18">
<path fill="currentColor" d="M11.52 9.206c0-1.4-.778-2.567-1.944-3.111v1.711L11.52 9.75v-.544zm1.945 0c0 .7-.156 1.4-.389 2.022l1.167 1.167c.544-.933.778-2.1.778-3.267 0-3.344-2.333-6.144-5.444-6.844v1.633c2.255.778 3.888 2.8 3.888 5.289zm-11.433-7L1.02 3.217l3.656 3.656H1.02v4.667h3.111l3.889 3.889v-5.211l3.344 3.344c-.544.389-1.089.7-1.789.933v1.633a6.64 6.64 0 0 0 2.878-1.4l1.556 1.556 1.011-1.011-7-7-5.988-6.067zm5.988.778L6.387 4.617 8.02 6.25V2.984z"></path></svg>`;
export const SOUND_ON_HTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 384" fill="currentColor">
<g>
	<g>
		<g>
			<path d="M288,192c0-37.653-21.76-70.187-53.333-85.867v171.84C266.24,262.187,288,229.653,288,192z"/>
			<polygon points="0,128 0,256 85.333,256 192,362.667 192,21.333 85.333,128    "/>
			<path d="M234.667,4.907V48.96C296.32,67.307,341.333,124.373,341.333,192S296.32,316.693,234.667,335.04v44.053     C320.107,359.68,384,283.413,384,192S320.107,24.32,234.667,4.907z"/>
		</g>
	</g>
</g>
</svg>`;

export const CHECK_MARK_HTML = `&#x2713;`;
