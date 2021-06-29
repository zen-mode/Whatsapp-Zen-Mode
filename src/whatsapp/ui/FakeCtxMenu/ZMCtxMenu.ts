import {FakeCtxMenu, FakeCtxMenuEventType, FakeCtxMenuItem} from "./FakeCtxMenu";
import {browser} from "webextension-polyfill-ts";
import {presentHiddenChatsLeftDrawer} from "../LeftDrawerHiddenChats";
import {clearHiddenChats, getHiddenChats} from "../../Storage";
import {construct_smartMute_menu_item, toggleSmartMute} from "../../../features/user-can/SmartMute/SmartMute";
import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {Selectors, StateItemNames, URLS} from "../../../data/dictionary";
import {set_el_style} from "../../../../utility-belt/helpers/dom/set-el-style";
import {remove_badge_el} from "../../../features/user-can/read-release-notes/remove-ver-num-badge";
import {set_extn_storage_item} from "../../../../utility-belt/helpers/extn/storage";

export interface ZMCtxMenuItem extends FakeCtxMenuItem {
  makeAction: () => void
}

const ZMMenuItems: ZMCtxMenuItem[] = [
  {
    action: 'smartMute',
    domNode: construct_smartMute_menu_item(),
    makeAction: toggleSmartMute
  },
  {
    action: 'hiddenChats',
    domNode: browser.i18n.getMessage('ZM_ctxMenuItem_hiddenChats'),
    makeAction: async () => presentHiddenChatsLeftDrawer(await getHiddenChats())
  },
  {
    action: 'unhideAll',
    domNode: browser.i18n.getMessage("ZM_ctxMenuItem_unhideAll"),
    makeAction: clearHiddenChats
  },
  {
    action: 'releaseNotes',
    domNode: browser.i18n.getMessage("ZM_ctxMenuItem_releaseNotes"),
    makeAction: () => {
      const releaseNotesAreaEl = DOM.get_el(Selectors.ZM_RELEASE_NOTES_AREA);
      set_el_style(releaseNotesAreaEl, {display: "initial"});

      remove_badge_el();

      set_extn_storage_item({[StateItemNames.RELEASE_NOTES_VIEWED]: true});
    },
  },
  {
    action: 'sendFeedback',
    domNode: browser.i18n.getMessage("ZM_ctxMenuItem_contactUs"),
    makeAction: () => {
      const subject = "Zen Mode extension feedback";

      window.open(`${URLS.FEEDBACK_EMAIL}?subject=${subject}`);
    },
  }
];

export class ZMCtxMenu extends FakeCtxMenu {
  constructor() {
    super('ZM', ZMMenuItems);
    // Initial render
    document.body.append(this._node!);
    // @ts-ignore
    this._node.addEventListener('itemClick' as FakeCtxMenuEventType, this.handleItemClick);
    // @ts-ignore
    this._node.addEventListener('clickToEmptySpace' as FakeCtxMenuEventType, () => this.isVisible = false);
  }

  /**
   * Used to change chat by item click.
   */
  handleItemClick = (e: CustomEvent) => {
    const {item} = e.detail as { item: ZMCtxMenuItem };
    item.makeAction();
    this.isVisible = false;
  }
}
