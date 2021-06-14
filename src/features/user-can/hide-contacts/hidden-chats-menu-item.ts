import {construct_zen_mode_ctx_menu_item} from "../use-zen-mode-ctx-menu/construct-zen-mode-ctx-menu-item";
import {presentHiddenChatsLeftDrawer} from "../../../whatsapp/ui/LeftDrawerHiddenChats";
import {getHiddenChats} from "../../../whatsapp/Storage";
import {browser} from "webextension-polyfill-ts";

export function construct_hidden_chats_menu_item(): HTMLElement {
  return construct_zen_mode_ctx_menu_item(browser.i18n.getMessage('ZM_ctxMenuItem_hiddenChats'), async ()=>{
    presentHiddenChatsLeftDrawer(await getHiddenChats());
  });
}
