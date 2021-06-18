import {process_error} from "../../features/extension-can/process-errors/process-error";
import {Chat} from "../model/Chat";

export interface FakeCtxMenuItem {
  action: string,
  title: string,
  chatChange: (chat: Chat) => void
}

export interface FakeCtxMenuCoords {
  x: number,
  y: number
}

export class FakeCtxMenu {
  _coords: FakeCtxMenuCoords = {x: 0, y: 0};
  _node: HTMLElement | null = null;
  _isVisible: boolean = false;
  items: FakeCtxMenuItem[];
  chat: Chat | null = null;

  constructor(items: FakeCtxMenuItem[]) {
    this.items = items;
    this._node = this._render();
    this._node.addEventListener('click', this.handleItemClick);
    this._node.onmouseover = this.handleMouseOver;
  }

  get node() {
    return this._node;
  }

  get isVisible() {
    return this._isVisible;
  }

  set isVisible(value) {
    this._isVisible = value;
    if (!this._node) return;
    if (this._isVisible) {
      this._node.style.animationName = 'showFakeCtxMenu';
    } else {
      this._node.style.animationName = 'hideFakeCtxMenu';
    }
  }

  attachToChat = (chat: Chat, anchor: HTMLElement) => {
    if (this.chat) {
      if (this.chat.id === chat.id) return;
      this.detachChat(chat);
    }
    this.chat = chat;
    this.isVisible = true;
    this._tieToAnchor(anchor);
  }

  detachChat = (chat: Chat) => {
    if (this.chat && this.chat.id !== chat.id) return;
    this.chat = null;
    this.isVisible = false;
  }

  /**
   * Fired by click. Used to change chat depending menu item action.
   */
  handleItemClick = (e: MouseEvent) => {
    // @ts-ignore
    const targetItem = e.target.closest('[data-action]');
    if (!targetItem) return;
    const item = this.items.find(item => item.action === targetItem.dataset.action);
    if (!item) {
      return process_error(
        new Error('Ctx menu item not found with action:' + targetItem.dataset.action)
      );
    } else if (!this.chat) {
      return process_error(
        new Error('Chat not attached:' + this.chat)
      );
    }
    // Continue if there are context menu item and chat.
    e.stopPropagation();
    item.chatChange(this.chat);
  };

  /**
   * Used to emulate native hover effect
   */
  handleMouseOver = (e: MouseEvent) => {
    // @ts-ignore
    const targetItem = e.target.closest('._3UHfW');
    if (!targetItem) return;
    targetItem.classList.add('H774S');
    targetItem.onmouseout = () => {
      targetItem.classList.remove('H774S');
      targetItem.onmouseout = null; // Clear memory
    }
  };

  _render() {
    if (!this._node) {
      const div = document.createElement('DIV');
      div.className = '_1qAEq fakeCtxMenu';
      div.tabIndex = -1;
      div.innerHTML = `<ul>${
        this.items.map(item => `<li class="_2iavx _2CDB7 _3UHfW" data-action="${item.action}">
              <div class="_11srW _2xxet">${item.title}</div>
            </li>`)
      }</ul>`;

      return div;
    }
    return this._node;
  }

  _tieToAnchor(anchor: HTMLElement) {
    if (!this._node) {
      return process_error(new Error('node is required' + this._node));
    }
    if (!document.body.contains(this._node)) {
      document.body.append(this._node);
    }
    // Set menu coords depending anchor coords
    const anchorCoords = anchor.getBoundingClientRect();
    this._node.style.left = anchorCoords.x + (anchorCoords.width / 2) + 'px';

    if (window.innerHeight > anchorCoords.bottom + this._node.clientHeight) {
      this._node.style.transformOrigin = 'left top';
      this._node.style.top = anchorCoords.bottom + 'px';
      this._node.style.bottom = ''; // Clear memory
    } else {
      this._node.style.transformOrigin = 'left bottom';
      this._node.style.bottom = window.innerHeight - anchorCoords.top + 'px';
      this._node.style.top = ''; // Clear memory
    }
  }
}
