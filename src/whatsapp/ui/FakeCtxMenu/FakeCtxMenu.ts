import {process_error} from "../../../features/extension-can/process-errors/process-error";

// Structure types
export interface FakeCtxMenuItem {
  action: string,
  domNode: string | HTMLElement
}
export type FakeCtxMenuEventType = 'clickToEmptySpace' | 'itemClick';

// Features types
export type FakeCtxMenuType = 'hiddenChat' | 'ZM';

export class FakeCtxMenu {
  _type: FakeCtxMenuType;
  _node: HTMLElement | null = null;
  _isVisible: boolean = false;
  items: FakeCtxMenuItem[];

  constructor(type: FakeCtxMenuType, items: FakeCtxMenuItem[]) {
    this._type = type;
    this.items = items;
    // Render node
    this._node = this._render();
    // Set listeners
    this._node.addEventListener('click', this.handleClick);
    this._node.onmouseover = this.handleMouseOver;
    window.addEventListener('click', this.handleClickToEmptySpace);
    window.addEventListener('contextmenu', this.handleClickToEmptySpace, true);
  }

  get node() {
    return this._node;
  }

  get isVisible() {
    return this._isVisible;
  }

  set isVisible(value) {
    if (this._isVisible === value) return;
    // Set state
    this._isVisible = value;
    // Render
    if (!this._node) return;
    if (this._isVisible) {
      this._node.style.animationDuration = '.2s';
      this._node.style.animationName = 'showFakeCtxMenu';
    } else {
      this._node.style.animationDuration = '.1s';
      this._node.style.animationName = 'hideFakeCtxMenu';
    }
  }

  /**
   * Fired by click. Used to handle menu item action.
   */
  handleClick = (e: MouseEvent) => {
    // @ts-ignore
    const targetItem = e.target.closest('[data-action]');
    if (!targetItem) return;
    const item = this.items.find(item => item.action === targetItem.dataset.action);
    if (!item) {
      return process_error(
        new Error('Ctx menu item not found with action:' + targetItem.dataset.action)
      );
    }
    // Continue if there are context menu item and chat.
    e.stopPropagation();
    targetItem.dispatchEvent(new CustomEvent('itemClick' as FakeCtxMenuEventType, {
      bubbles: true,
      detail: {item}
    }));
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

  /**
   * Used to close by click to empty space (exclude menu node).
   */
  handleClickToEmptySpace = (e: MouseEvent) => {
    if (!this._node || !this.isVisible) return;
    if (this._node.contains(e.target as HTMLElement)) {
      return; // Click inside ctx menu
    }
    // Any click outside ctx menu
    this._node.dispatchEvent(new CustomEvent('clickToEmptySpace' as FakeCtxMenuEventType, {
      bubbles: true
    }));
  }

  tieToAnchor(anchorCoords: ClientRect) {
    if (!this._node) {
      return process_error(new Error('node is required' + this._node));
    }
    if (!document.body.contains(this._node)) {
      document.body.append(this._node);
    }
    // Set state
    this.isVisible = true;
    // Set menu coords depending anchor coords
    const direction = document.documentElement.getAttribute('dir');
    const left = anchorCoords.left + (anchorCoords.width / 2);
    let xOrigin = 'left';
    if (direction === 'RTL' && left + this._node.clientWidth > window.innerWidth) {
      xOrigin = 'right';
      this._node.style.left = left - this._node.clientWidth + 'px';
    } else {
      this._node.style.left = left + 'px';
    }

    if (window.innerHeight > anchorCoords.bottom + this._node.clientHeight) {
      this._node.style.transformOrigin = `${xOrigin} top`;
      this._node.style.top = anchorCoords.bottom + 'px';
      this._node.style.bottom = ''; // Clear memory
    } else {
      this._node.style.transformOrigin = `${xOrigin} bottom`;
      this._node.style.bottom = window.innerHeight - anchorCoords.top + 'px';
      this._node.style.top = ''; // Clear memory
    }
  }

  _render() {
    if (!this._node) {
      const itemLis = this.items.map(item => {
        const li = document.createElement('LI');
        li.className = "_2iavx _2CDB7 _3UHfW";
        li.setAttribute('data-action', item.action);
        li.innerHTML = '<div class="_11srW _2xxet"></div>';
        li.children[0]!.append(item.domNode);

        return li;
      });
      const div = document.createElement('DIV');
      div.className = '_1qAEq fakeCtxMenu';
      div.setAttribute('data-menu-type', this._type);
      div.tabIndex = -1;
      div.style.opacity = '0';
      div.style.transform = 'scale(0)';
      div.innerHTML = `<ul></ul>`;
      // Items appending
      div.children[0]!.append(...itemLis);

      return div;
    }
    return this._node;
  }
}
