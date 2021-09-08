import {GenericFn} from "../../../../utility-belt/types/generic-types";
import { ZMCtxMenuItem } from "../../../whatsapp/ui/FakeCtxMenu/ZMCtxMenu";

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
  children: ZMCtxMenuItem[] = []
): HTMLLIElement {
  const li = document.createElement('LI') as HTMLLIElement;
  li.className = "_1wMaz _18oo2 fakeCtxMenuItem";
  if (typeof action === 'string') {
    li.setAttribute('data-action', action);
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

