import * as DOMReference from "./DOMConstants";
import {CHAT_NODE_CLASS} from "./DOMConstants";

export class ChatNode {
  static _cclass = `.${CHAT_NODE_CLASS}`;
  constructor(node, findClosest = true, checkIsChat = true) {
    this.node = findClosest ? node.closest(ChatNode._cclass) : node;
    if (checkIsChat && !this._check()) {
      throw 'Node is not root chat element' + node.classList;
    }
  }

  _check() {
    return this.node
      && this.node.classList.contains(DOMReference.CHAT_NODE_CLASS)
  }

  title() {
    if (!this._titleNode) {
      this._titleNode = this.node.querySelector(DOMReference.CHAT_NODE_TITLE_SELECTOR);
    }
    return this._titleNode.getAttribute(DOMReference.CHAT_NODE_TITLE_ATTR) ?? void 0;
  }

  infoContainer() {
    if (!this._infoNode) {
      this._infoNode = this.node.querySelector(DOMReference.CHAT_NODE_INFO_SELECTOR);
    }
    return this._infoNode;
  }
}
