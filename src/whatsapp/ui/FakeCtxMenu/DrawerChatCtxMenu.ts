import {FakeCtxMenu, FakeCtxMenuEventType, FakeCtxMenuItem} from "./FakeCtxMenu";
import {Chat} from "../../model/Chat";
import {process_error} from "../../../features/extension-can/process-errors/process-error";

export interface DrawerChatCtxMenuItem extends FakeCtxMenuItem {
  chatChange: (chat: Chat) => void
}

export class DrawerChatCtxMenu extends FakeCtxMenu {
  chat: Chat | null = null;

  constructor(items: DrawerChatCtxMenuItem[]) {
    super('drawerChat', items);
    // @ts-ignore
    this._node.addEventListener('itemClick' as FakeCtxMenuEventType, this.handleItemClick);
    // @ts-ignore
    this._node.addEventListener('clickToEmptySpace' as FakeCtxMenuEventType, () => this.detachChat(this.chat));
  }

  attachToChat = (chat: Chat, anchorCoords: ClientRect) => {
    if (this.chat) {
      if (this.chat.id === chat.id) {
        this.tieToAnchor(anchorCoords);
        return;
      }
      this.detachChat(chat);
    }
    this.chat = chat;
    this.tieToAnchor(anchorCoords);
  }

  detachChat = (chat: Chat) => {
    if (this.chat && this.chat.id !== chat.id) return;
    this.chat = null;
    this.isVisible = false;
  }

  /**
   * Used to change chat by item click.
   */
  handleItemClick = (e: CustomEvent) => {
    const { item } = e.detail as { item: DrawerChatCtxMenuItem };
    if (!this.chat) {
      return process_error(
        new Error('Chat not attached:' + JSON.stringify(this.chat))
      );
    }
    item.chatChange(this.chat);
    this._node?.remove();
  }
}
