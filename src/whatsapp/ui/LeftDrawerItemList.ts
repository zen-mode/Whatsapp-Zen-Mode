import {DOM} from "../../../utility-belt/helpers/dom/DOM-shortcuts";
import {devprint} from "../../../utility-belt/helpers/debug/devprint";

export interface LeftDrawerItemList<T> {
  close(): void
  open(): void
  set(item: T[]): void
  add(item: T): void
  remove(item: T): void
  clear(): void
}

const DRAWER_ID = 'fakeElLikeWAArchivedChats';
const DRAWER_TITLE_ID = 'fakeElLikeWAArchiveTITLE';
const DRAWER_ITEMS_CONTAINER_ID = 'CHATS_CONTAINER_ID';
const DRAWER_CONTAINER_HEIGHT_PX = 72;
const DRAWER_UP_BUTTON_ID = 'backButton';

export function constructBaseLeftDrawerItemList<T>(title: string,
                                                   items: T[],
                                                   onBackButtonClick: () => void,
                                                   constructItemEl: (item: T) => HTMLElement,
                                                   onClickOnItemEl: (event: MouseEvent, item: T) => void,
                                                   constructEmptyPlugEl: () => HTMLElement): LeftDrawerItemList<T> {
  const leftDrawerContainer = DOM.get_el('._1Flk2._2DPZK');
  if (!leftDrawerContainer) {
    throw Error('WWALeftDrawerContainer not presented');
  }

  function constructRootDrawer(): {
    drawerEl: HTMLElement,
    backButtonEl: HTMLElement,
    titleEl: HTMLElement,
    itemsContainerEl: HTMLElement,
    emptyPlugContainerEl: HTMLElement
  } {
    leftDrawerContainer!!.insertAdjacentHTML("beforeend", `
<span id="${DRAWER_ID}" class="_2zn9Y">
   <div class="_1sMV6" tabindex="-1" style="height: 100%; transform: translateX(0%);">
      <span class="_1t1U-">
         <div class="OMoBQ _2uJIN _3wXwX copyable-area">
            <header class="_2heqZ">
               <div class="_2fGIm" data-animate-drawer-title="true">
                  <div class="_215wZ">
                     <button id='${DRAWER_UP_BUTTON_ID}' class="_27F2N">
                        <span data-testid="back" data-icon="back" class="">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                              <path fill="currentColor" d="M12 4l1.4 1.4L7.8 11H20v2H7.8l5.6 5.6L12 20l-8-8 8-8z"></path>
                           </svg>
                        </span>
                     </button>
                  </div>
                  <div id="${DRAWER_TITLE_ID}" class="_1XrsE"></div>
               </div>
            </header>
            <div id="${DRAWER_ITEMS_CONTAINER_ID}" class="_1C2Q3 _36Jt6">
            </div>
         </div>
         <div hidden="" style="display: none;"></div>
      </span>
   </div>
   <div hidden="" style="display: none;"></div>
</span>
`);
    const drawerEl = DOM.get_el('#' + DRAWER_ID, leftDrawerContainer!!)!!;
    drawerEl.remove();
    const itemsContainerEl = DOM.get_el('#' + DRAWER_ITEMS_CONTAINER_ID, drawerEl)!!;
    return {
      backButtonEl: DOM.get_el('#' + DRAWER_UP_BUTTON_ID, drawerEl)!,
      itemsContainerEl: itemsContainerEl,
      emptyPlugContainerEl: itemsContainerEl,
      drawerEl: drawerEl,
      titleEl: DOM.get_el('#' + DRAWER_TITLE_ID, drawerEl)!!
    }
  }

  const {
    drawerEl,
    titleEl,
    backButtonEl,
    itemsContainerEl,
    emptyPlugContainerEl
  } = constructRootDrawer();

  const itemElToItem = new Map<HTMLElement, T>();

  let currentEmptyPlugEl: Element | null;

  function setEmptyPlugEl(element: HTMLElement | null) {
    devprint('setEmptyPlugEl', element);
    devprint('currentEmptyPlugEl', currentEmptyPlugEl);
    if (element) {
      if (currentEmptyPlugEl) {
        currentEmptyPlugEl.remove();
      }
      currentEmptyPlugEl = emptyPlugContainerEl.insertAdjacentElement('afterbegin', element);
    } else if (currentEmptyPlugEl) {
      currentEmptyPlugEl.remove();
      currentEmptyPlugEl = null;
    }
  }

  function addAndShowDrawer() {
    leftDrawerContainer!!.insertAdjacentElement('beforeend', drawerEl);
  }

  function removeDrawer() {
    drawerEl.remove();
  }

  function bindItem(item: T) {
    const itemEl = constructItemEl(item);
    itemEl.oncontextmenu = event => {
      event.preventDefault();
      onClickOnItemEl(event, item);
    };
    itemsContainerEl.appendChild(itemEl);
    itemElToItem.set(itemEl, item);
  }

  function clearItem(item: T) {
    for (const e of itemElToItem.entries()) {
      if (item === e[1]) {
        const itemEl = e[0];
        itemElToItem.delete(itemEl);
        itemEl.remove();
        return;
      }
    }
  }

  function clearItems() {
    for (const e of itemElToItem.entries()) {
      const itemEl = e[0];
      itemElToItem.delete(itemEl);
      itemEl.remove();
    }
  }

  function onItemsChange() {
    devprint('itemElToItem.size > 0', itemElToItem.size > 0)
    devprint('itemElToItem', itemElToItem)
    if (itemElToItem.size > 0) {
      setEmptyPlugEl(null);
      let currentIndex = -1;
      for (const itemEl of itemElToItem.keys()) {
        currentIndex++;
        itemEl.style.transform = `translateY(${currentIndex * DRAWER_CONTAINER_HEIGHT_PX}px)`;
      }
    } else {
      setEmptyPlugEl(constructEmptyPlugEl());
    }
  }

  titleEl.textContent = title;
  backButtonEl.addEventListener('click', () => {
    onBackButtonClick();
    removeDrawer();
  });
  for (const item of items) {
    bindItem(item);
  }
  onItemsChange();

  return {
    set: (item: T[]) => {
      clearItems();
      item.forEach(bindItem);
      onItemsChange();
    },
    add: (item: T) => {
      bindItem(item);
      onItemsChange();
    },
    remove: (item: T) => {
      clearItem(item);
      onItemsChange();
    },
    clear: () => {
      clearItems();
      onItemsChange();
    },
    close: removeDrawer,
    open: addAndShowDrawer
  }
}
