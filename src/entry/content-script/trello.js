import {
    get_extn_storage_item_value,
    remove_extn_storage_item,
    set_extn_storage_item
} from "../../../utility-belt/helpers/extn/storage";
import {DOM} from "../../../utility-belt/helpers/dom/DOM-shortcuts";
import {Selectors} from "../../data/dictionary";
import {browser} from "webextension-polyfill-ts";

let trelloStatus = null;
let trelloIcon = null;
let trelloContextImg = null;
let trelloContextList = null;
let isAddedContextOptions = false;
let isHideColumn = 'ON';
let selectedColumn = -1;
let enabledObservers = false;
let isAddedIcon = false;

const config = {
  attributes: true,
  childList: true,
  subtree: true
};

const callback = function(mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      addContextMenu();
    }
  }
};

const board_callback = function(mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      addEventListenerForListButton();
    }
  }
};

const window_callback = function(mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      updateBackground();
    }
  }
};

function updateIcon(status) {
    trelloIcon.src = chrome.runtime.getURL(
        `assets/logo/${status === 'ON' ? "logo.png" : "logo-off.png"}`,
    );
    trelloContextImg.src = chrome.runtime.getURL(
      `assets/logo/${status === 'ON' ? "logo.png" : "logo-off.png"}`,
    );
}

function updateBackground() {
    if (trelloStatus === 'ON' && document.querySelector('.card-detail-window')) {
        document.querySelector(Selectors.ZM_TRELLO_WINDOW_OVERLAY).style.backgroundColor = '#f4f5f7';
        document.querySelector('.card-detail-window').classList.add('card-detail-border');
    }
    else {
        document.querySelector(Selectors.ZM_TRELLO_WINDOW_OVERLAY).style.backgroundColor = 'rgba(0,0,0,.64)';
    }
}

function handleIconClick() {
    trelloStatus = trelloStatus === 'ON' ? 'OFF' : 'ON';
    updateIcon(trelloStatus);
    set_extn_storage_item({ TRELLO_STATUS: trelloStatus });
    updateBackground();
}

function addIcon(status) {
    const siblingButton =
        document.querySelector('[data-test-id="header-create-menu-button"]') ||
        document.querySelector('[aria-label="Create board or Workspace"]') ||
        document.querySelector('[data-test-id="header-info-button"]') ||
        document.querySelector('[aria-label="Open information menu"]') ||
        document.querySelector('[data-test-id="header-notifications-button"]') ||
        document.querySelector('[aria-label="Notifications"]') ||
        document.querySelector('[data-test-id="header-member-menu-button"]') ||
        document.querySelector('[aria-label="Open member menu"]');
    const parent = siblingButton && siblingButton.parentElement;
    if (parent) {
        trelloIcon = new window.Image();
        trelloIcon.classList.add('zen-mode-trello-icon');
        trelloIcon.src = chrome.runtime.getURL(`assets/logo/${status === 'ON' ? "logo.png" : "logo-off.png"}`);
        trelloIcon.addEventListener('click', handleIconClick);
        parent.prepend(trelloIcon);
    }
    else {
        console.log('no parent found');
    }
}

function addElementInContext(element) {
    let parent = document.querySelector(Selectors.ZM_TRELLO_POP_OVER_CONTENT);
    if (parent) {
        let pop_over_list = document.getElementsByClassName(Selectors.ZM_TRELLO_POP_OVER_LIST);
        if (pop_over_list && pop_over_list.item(pop_over_list.length - 1).parentElement) {
          pop_over_list.item(pop_over_list.length - 1).parentElement.append(element);
        }
    }
}

function addContextMenu() {
    if (!isAddedContextOptions) {
        let stripCutter = document.createElement('hr');
        addElementInContext(stripCutter);
        trelloContextImg = new window.Image();
        trelloContextImg.classList.add('zen-mode-trello-context-icon');

        trelloContextImg.src = chrome.runtime.getURL(`assets/logo/${trelloStatus === 'ON' ? "logo.png" : "logo-off.png"}`);
        trelloContextList = document.createElement('ul');
        let li_item = document.createElement('li');
        li_item.classList.add('zen-mode__context-menu');
        li_item.textContent = browser.i18n.getMessage('ZM_Trello_Context_ZenMode');
        li_item.addEventListener('click', function() {
            handleIconClick();
            hidePopOver();
        });
        li_item.appendChild(trelloContextImg);
        trelloContextList.appendChild(li_item);
        let hideOption = document.createElement('li');
        hideOption.classList.add('hide-or-show-option');
        hideOption.addEventListener('click', hideOrShowColumnOption);
        if (isHideColumn === 'ON') {
            hideOption.innerText = browser.i18n.getMessage('ZM_Trello_Hide_Options');
        } else {
            hideOption.innerText = browser.i18n.getMessage('ZM_Trello_Show_Options');
        }
        trelloContextList.appendChild(hideOption);
        addElementInContext(trelloContextList);

        isAddedContextOptions = true;
    }

}

function hideOrShowColumnOption() {
    let list_wrappers = document.getElementsByClassName(Selectors.ZM_TRELLO_LIST_CONTENT);
    if (isHideColumn === 'ON') {
        for (let item of list_wrappers) {
            if (!item.classList.contains('selected-column')) {
                item.style.display = 'none';
            }
        }
    } else {
        for (let item of list_wrappers) {
            if (!item.classList.contains('selected-column')) {
                item.style.display = 'flex';
            }
        }
    }
    isHideColumn = isHideColumn === 'ON' ? 'OFF' : 'ON';
    set_extn_storage_item({ HIDE_COLUMNS: isHideColumn });
    hidePopOver();
}


function hidePopOver() {
    let pop_over_close_btn = document.querySelector(Selectors.ZM_TRELLO_CLOSE_POP_OVER_BTN);
    let event = new Event("click", {bubbles: true});
    pop_over_close_btn.dispatchEvent(event);
}

function addEventListenerForListButton() {
    let button_list = document.getElementsByClassName(Selectors.ZM_TRELLO_LIST_HEADER);
    for (let item of button_list) {
        item.addEventListener('click', function() {
            removeSelectedColumns();
            let parent = this.parentElement.parentElement;
            parent.classList.add('selected-column');
            checkSelectedIndex();
            isAddedContextOptions = false;
        });
    }
}

function removeSelectedColumns() {
    let list_wrappers = document.getElementsByClassName(Selectors.ZM_TRELLO_LIST_CONTENT);
    for (let item of list_wrappers) {
        if (item.classList.contains('selected-column')) {
            item.classList.remove('selected-column');
        }
    }
}

function checkSelectedIndex() {
    let list_wrappers = document.getElementsByClassName(Selectors.ZM_TRELLO_LIST_CONTENT);
    for (let i = 0; i < list_wrappers.length; i++) {
        if (list_wrappers[i].classList.contains('selected-column')) {
            set_extn_storage_item({ SELECTED_ITEM: i });
        }
    }
}

function addObservers() {
  let pop_over = document.querySelector(Selectors.ZM_TRELLO_POP_OVER);
  if (pop_over) {
    const observer = new MutationObserver(callback);
    observer.observe(pop_over, config);
  }
  let board = document.getElementById('board');
  if (board) {
    const board_observer = new MutationObserver(board_callback);
    board_observer.observe(board, config);
  }
  let window_overlay = document.querySelector(Selectors.ZM_TRELLO_WINDOW_OVERLAY);
  if (window_overlay) {
    const window_overlay_observer = new MutationObserver(window_callback);
    window_overlay_observer.observe(window_overlay, config);
  }
}

const observer = new MutationObserver(async (mutations) => {
  trelloStatus = await get_extn_storage_item_value('TRELLO_STATUS') || 'ON';
  isHideColumn = await get_extn_storage_item_value('HIDE_COLUMNS') || 'ON';
  selectedColumn = await get_extn_storage_item_value('SELECTED_ITEM');
  if (typeof selectedColumn === 'undefined') {
    selectedColumn = -1;
  }
  mutations
    .filter(mutation => mutation.type === 'childList')
    .forEach(mutation => {
        if (DOM.get_el('#header') && !isAddedIcon) {
          addIcon(trelloStatus);
          isAddedIcon = true;
        }
        if (DOM.get_el('#board') && !enabledObservers) {
          addObservers();
          if (selectedColumn > -1 && isHideColumn === 'OFF') {
              let list_wrappers = document.getElementsByClassName(Selectors.ZM_TRELLO_LIST_CONTENT);
              list_wrappers[selectedColumn].classList.add('selected-column');
              for (let item of list_wrappers) {
                  if (!item.classList.contains('selected-column')) {
                      item.style.display = 'none';
                  }
              }
          }
          enabledObservers = true;
        }
        if (isAddedIcon && enabledObservers) {
            observer.disconnect();
        }
    });
});

observer.observe(document.body, config);
