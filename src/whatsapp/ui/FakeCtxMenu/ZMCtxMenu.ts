import { FakeCtxMenu, FakeCtxMenuEventType, FakeCtxMenuItem } from "./FakeCtxMenu";
import browser from "webextension-polyfill";
import { clearHiddenChats, getHiddenChats } from "../../Storage";
import {
  construct_smartMute_menu_item,
  toggleSmartMute,
} from "../../../features/user-can/SmartMute/SmartMute";
import { DOM } from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import { Selectors, StateItemNames, URLS } from "../../../data/dictionary";
import { set_el_style } from "../../../../utility-belt/helpers/dom/set-el-style";
import { remove_badge_el } from "../../../features/user-can/read-release-notes/remove-ver-num-badge";
import { set_extn_storage_item } from "../../../../utility-belt/helpers/extn/storage";
import { presentUnreadChats } from "../NavigationDrawer/UnreadChats";
import { getUnreadChats } from "../../ExtensionConnector";
import { logger } from "../../StorageLogger";
import { constructDebugModeMenuItem, toggleDebugMode } from "../MenuItems/debugMode";
import { buildOfflineModeMenuItem, toggleOfflineMode } from "../MenuItems/offlineMode";
import { buildPinnedChatsStatusMenuItem, togglePinnedChatsStatusMode } from "../MenuItems/pinnedChatsStatus";

export interface ZMCtxMenuItem extends FakeCtxMenuItem {
  makeAction?: () => void;
  children?: ZMCtxMenuItem[];
}

let ZMMenuItems: ZMCtxMenuItem[] = [
  {
    action: "unreadChats",
    domNode: browser.i18n.getMessage("ZM_ctxMenuItem_unreadChats"),
    makeAction: async () => getUnreadChats(presentUnreadChats),
  },
  {
    action: "releaseNotes",
    domNode: browser.i18n.getMessage("ZM_ctxMenuItem_releaseNotes"),
    makeAction: () => {
      const releaseNotesAreaEl = DOM.get_el(Selectors.ZM_RELEASE_NOTES_AREA);
      set_el_style(releaseNotesAreaEl, { display: "initial" });

      remove_badge_el();

      set_extn_storage_item({ [StateItemNames.RELEASE_NOTES_VIEWED]: true });
    },
  },
  {
    action: "smartMute",
    domNode: construct_smartMute_menu_item(),
    makeAction: toggleSmartMute,
  },  
  {
    action: "showPinnedChatsStatus",
    domNode: buildPinnedChatsStatusMenuItem(),
    makeAction: togglePinnedChatsStatusMode,
  },
  {
    action: "offlineMode",
    domNode: buildOfflineModeMenuItem(),
    makeAction: toggleOfflineMode,
  },
  {
    action: "debugMode",
    domNode: constructDebugModeMenuItem(),
    makeAction: toggleDebugMode,
  },
  {
    action: "sendFeedback",
    domNode: browser.i18n.getMessage("ZM_ctxMenuItem_contactUs"),
    makeAction: () => {
      const subject = "Zen Mode extension feedback";

      window.open(`${URLS.FEEDBACK_EMAIL}?subject=${subject}`);
    },
  },  
];

export const debugModeItems = [
  {
    action: "getLog",
    domNode: browser.i18n.getMessage("ZM_ctxMenuItem_debugModeCopyToClipboard"),
    makeAction: async () => {
      const log = await logger.getLog();
      await navigator.clipboard.writeText(JSON.stringify(log));
      window.alert("Copied to clipboard");
    },
  },
  {
    action: "clearLog",
    domNode: browser.i18n.getMessage("ZM_ctxMenuItem_debugModeClearLog"),
    makeAction: async () => {
      await logger.clearLog();
      window.alert("Extension log is cleared");
    },
  },
];

ZMMenuItems = [
  ...ZMMenuItems,
  //   ...debugModeItems
];

export const debugModeActions = debugModeItems.map(it => it.action)

class ZMCtxMenu extends FakeCtxMenu {
  constructor(menuItems: ZMCtxMenuItem[]) {
    super("ZM", menuItems);
    // Initial render
    document.body.append(this._node!);
    this._setEventListeners();
  }

  /**
   * Used to change chat by item click.
   */
  handleItemClick = (e: CustomEvent) => {
    const { item } = e.detail as { item: ZMCtxMenuItem };
    if (item.makeAction) {
      item.makeAction();
    }
    this.isVisible = false;
  };

  addItems(newItems: FakeCtxMenuItem[]) {
    this._removeEventListeners();
    super.addItems(newItems);
    this._setEventListeners()
  }

  removeItems(actions: string[]) {
    this._removeEventListeners();
    super.removeItems(actions);
    this._setEventListeners();
  }

  private _removeEventListeners() {
    if (this._node) {
      // @ts-ignore
      this._node.removeEventListener(
        "itemClick" as FakeCtxMenuEventType,
        this.handleItemClick
      );
      // @ts-ignore
      this._node.removeEventListener(
        "clickToEmptySpace" as FakeCtxMenuEventType,
        () => (this.isVisible = false)
      );
    }
  }

  private _setEventListeners() {
    // @ts-ignore
    this._node.addEventListener(
      "itemClick" as FakeCtxMenuEventType,
      this.handleItemClick,
    );
    // @ts-ignore
    this._node.addEventListener(
      "clickToEmptySpace" as FakeCtxMenuEventType,
      () => (this.isVisible = false),
    );
  }
}

export default new ZMCtxMenu(ZMMenuItems);
