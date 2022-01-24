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

const DRAWER_TITLE_ID = 'fakeElLikeWAArchiveTITLE';
const DRAWER_ITEMS_CONTAINER_ID = 'CHATS_CONTAINER_ID';
const DRAWER_CONTAINER_HEIGHT_PX = 72;
const DRAWER_UP_BUTTON_ID = 'backButton';

export function constructBaseLeftDrawerItemList<T>(title: string,
                                                   items: T[], onBackButtonClick: (event: MouseEvent) => void,
                                                   constructItemEl: (item: T) => HTMLElement,
                                                   onClickOnItemEl: (event: MouseEvent, item: T) => void,
                                                   constructEmptyPlugEl?: () => HTMLElement): LeftDrawerItemList<T> {
  const leftDrawerContainer = (() => {
    const element = DOM.get_el('.ldL67._2i3T7');
    if (!element) {
      throw Error('WWALeftDrawerContainer not presented');
    }
    return element;
  })();

  function constructRootDrawer(): {
    drawerEl: HTMLElement,
    backButtonEl: HTMLElement,
    titleEl: HTMLElement,
    itemsContainerEl: HTMLElement,
    emptyPlugContainerEl: HTMLElement
  } {
    const drawerEl = document.createElement('span');
    drawerEl.className = 'vXLk5';
    drawerEl.innerHTML = `
        <div class="_1N4rE" tabindex="-1" style="height: 100%; transform: translateX(0%);">
          <span class="_2J8hu">
             <div class="ihvf49ua p357zi0d f8m0rgwh ppled2lx tkdu00h0 gfz4du6o r7fjleex jv8uhy2r lhggkp7q qq0sjtgm ln8gz9je tm2tP copyable-area">
                <header class="_1PGhQ">
                   <div class="_1Yy4I" data-animate-drawer-title="true">
                      <div class="_2-1k7">
                         <button id='${DRAWER_UP_BUTTON_ID}' class="_18eKe" aria-label="Назад">
                            <span data-testid="back" data-icon="back" class="">
                               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                  <path fill="currentColor" d="M12 4l1.4 1.4L7.8 11H20v2H7.8l5.6 5.6L12 20l-8-8 8-8z"></path>
                               </svg>
                            </span>
                         </button>
                      </div>
                      <div id="${DRAWER_TITLE_ID}" class="_1FrBz"></div>
                   </div>
                </header>
                <div id="${DRAWER_ITEMS_CONTAINER_ID}" class="_3Bc7H KPJpj"></div>
             </div>
             <div hidden="" style="display: none;"></div>
          </span>
        </div>
        <div hidden="" style="display: none;"></div>
    `;
    leftDrawerContainer.insertAdjacentElement('beforeend', drawerEl);
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
    leftDrawerContainer.insertAdjacentElement('beforeend', drawerEl);
  }

  function releaseDrawer() {
    drawerEl.innerHTML = '';
    drawerEl.remove();
    itemElToItem.clear();
  }

  function bindItem(item: T) {
    const itemEl = constructItemEl(item);
    itemEl.onclick = event => {
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
    itemsContainerEl.innerHTML = '';
    itemElToItem.clear();
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
    } else if (constructEmptyPlugEl) {
      setEmptyPlugEl(constructEmptyPlugEl());
    }
  }

  titleEl.textContent = title;
  backButtonEl.addEventListener('click', (event) => {
    onBackButtonClick(event);
    releaseDrawer();
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
    close: releaseDrawer,
    open: addAndShowDrawer
  }
}
