import {GenericFn} from "../../../../utility-belt/types/generic-types";

/**
 * Used to emulate native hover effect
 */
const handleMouseOver = (e: MouseEvent) => {
  // @ts-ignore
  const targetItem = e.target.closest('._3UHfW');
  if (!targetItem) return;
  targetItem.classList.add('H774S');
  targetItem.onmouseout = () => {
    targetItem.classList.remove('H774S');
    targetItem.onmouseout = null; // Clear memory
  }
};

export function constructFakeCtxMenuItem(
  domNodes: (HTMLElement | string)[],
  action: GenericFn | string,
): HTMLLIElement {
  const li = document.createElement('LI') as HTMLLIElement;
  li.className = "_2iavx _2CDB7 _3UHfW fakeCtxMenuItem";
  if (typeof action === 'string') {
    li.setAttribute('data-action', action);
  } else {
    li.addEventListener('click', (evt: MouseEvent) => {
      evt.stopImmediatePropagation();
      action();
    });
  }
  li.innerHTML = '<div class="_11srW _2xxet"></div>';
  li.children[0]!.append(...domNodes);
  li.addEventListener('mouseover', handleMouseOver);

  return li;
}
