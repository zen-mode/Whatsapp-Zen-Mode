import {GenericFn} from "../../../../utility-belt/types/generic-types";
import { ZMCtxMenuItem } from "../../../whatsapp/ui/FakeCtxMenu/ZMCtxMenu";
import browser from "webextension-polyfill";
import {StateItemNames} from "../../../data/dictionary";
import {get_extn_storage_item_value} from "../../../../utility-belt/helpers/extn/storage";
/**
 * Used to emulate native hover effect
 */
const handleMouseOver = (e: MouseEvent) => {
  // @ts-ignore
  let targetItem = e.target.closest('._3UHfW');
  let targetClass = 'H774S';
  if (!targetItem) {
    // @ts-ignore
    targetItem = e.target.closest('.fakeCtxMenuItemOpts');
    targetClass = 'show'
    if (!targetItem) return;
  }

  targetItem.classList.add(targetClass);
  targetItem.onmouseout = () => {
    targetItem.classList.remove(targetClass);
    targetItem.onmouseout = null; // Clear memory
  }
};

export function constructFakeCtxMenuItem(
  domNodes: (HTMLElement | string)[],
  action: GenericFn | string,
  children: ZMCtxMenuItem[] = [],
): HTMLLIElement {
  console.log(browser.i18n.getUILanguage());
  const li = document.createElement('LI') as HTMLLIElement;
  li.className = "_1wMaz _18oo2 fakeCtxMenuItem";

  if (domNodes[0] === "OFF Mini preview") {
    let div = document.createElement('div');
    div.classList.add('switch_text');
    div.innerHTML = "OFF Mini preview";
    domNodes[0] = div;
  }

  if (domNodes[0] === "ON Mini preview") {
    let div = document.createElement('div');
    div.classList.add('switch_text');
    div.innerHTML = "ON Mini preview";
    domNodes[0] = div;
  }

  if (typeof action === 'string') {
    li.setAttribute('data-action', action);

    if (action === 'releaseNotes') {
      if (localStorage.getItem('releaseNotesCheck') == null) {
        if (document.dir === 'rtl') {
          li.classList.add('releaseNotesItemForRTL');
        }else{
          li.classList.add('releaseNotesItem');
        }

        let tag = document.createElement('div');
        tag.className = "releaseNotesItemTag";
        tag.innerHTML = "NEW";
        li.append(tag);
      }
    }

  } else {
    li.addEventListener('click', (evt: MouseEvent) => {
      evt.stopImmediatePropagation();
      action();
    });
  }
  li.innerHTML = '<div class="_2oldI dJxPU"></div>';
  if (typeof action === 'string' && children.length > 0) {
    li.className = "_1wMaz _18oo2 fakeCtxMenuItem fakeCtxMenuItemOpts";
    const itemLis = children.map(item => constructFakeCtxMenuItem([item.domNode], item.action));

    li.innerHTML += '<ul class="o--vV _1qAEq fakeCtxMenuSettings"></ul>'
    li.children[1]!.append(...itemLis)
  }

  li.children[0]!.append(...domNodes);
  li.addEventListener('mouseover', handleMouseOver);

  return li;
}
