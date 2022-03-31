import { Selectors } from "../../data/dictionary";
import browser from "webextension-polyfill";

let trelloStatus = null;
let trelloIcon = null;
let trelloContextImg = null;
let trelloContextList = null;
let isAddedContextOptions = false;
let isHideColumn = null;
let selectedColumn = -1;
let enabledObservers = false;
let isAddedIcon = false;
let initStorage = false;

const config = {
    attributes: true,
    childList: true,
    subtree: true
};

function updateIcon(status) {
    if (trelloIcon) {
        trelloIcon.classList.toggle('zen-mode_On');
    }
    if (trelloContextImg) {
        trelloContextImg.classList.toggle('zen-mode_On');
    }
}

function updateBackground() {
    if (trelloStatus && document.querySelector('.card-detail-window')) {
        document.querySelector(Selectors.ZM_TRELLO_WINDOW_OVERLAY).classList.add('Zen-mode-active-overlay');
        document.querySelector('.card-detail-window').classList.add('card-detail-border');
    } else {
        if (document.querySelector(Selectors.ZM_TRELLO_WINDOW_OVERLAY).classList.contains('Zen-mode-active-overlay')) {
            document.querySelector(Selectors.ZM_TRELLO_WINDOW_OVERLAY).classList.remove('Zen-mode-active-overlay');
        }
    }
}

function handleIconClick() {
    trelloStatus = !trelloStatus;
    updateIcon(trelloStatus);
    chrome.storage.local.set({ TRELLO_STATUS: trelloStatus }, function() {});
    updateBackground();
}

function addIcon(status) {
    const siblingButton =
        //COMMENT: change parent element for create menu button.
        //document.querySelector('[data-test-id="header-create-menu-button"]') ||
        //document.querySelector('[aria-label="Create board or Workspace"]') ||
        //document.querySelector('[data-test-id="header-info-button"]') ||
        //document.querySelector('[aria-label="Open information menu"]') ||
        document.querySelector('[data-test-id="header-notifications-button"]') ||
        document.querySelector('[aria-label="Notifications"]') ||
        document.querySelector('[data-test-id="header-member-menu-button"]') ||
        document.querySelector('[aria-label="Open member menu"]');
    const parent = siblingButton && siblingButton.parentElement;
    if (parent) {
        trelloIcon = document.createElement('div');
        trelloIcon.classList.add('zen-mode-trello-icon');
        if (status) {
            trelloIcon.classList.toggle('zen-mode_On');
        }
        trelloIcon.addEventListener('click', handleIconClick);
        parent.prepend(trelloIcon);
    } else {
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
        trelloContextImg = document.createElement('div');
        trelloContextImg.classList.add('zen-mode-trello-context-icon');
        if (trelloStatus) {
            trelloContextImg.classList.toggle('zen-mode_On');
        }
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
        if (isHideColumn) {
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
    if (isHideColumn) {
        for (let item of list_wrappers) {
            if (!item.classList.contains('selected-column')) {
                item.classList.remove('show_column');
            }
        }
    } else {
        for (let item of list_wrappers) {
            if (!item.classList.contains('selected-column')) {
                item.classList.add('show_column');
            }
        }
    }
    isHideColumn = !isHideColumn;
    chrome.storage.local.set({ HIDE_COLUMNS: isHideColumn }, function() {});
    hidePopOver();
}


function hidePopOver() {
    let pop_over_close_btn = document.querySelector(Selectors.ZM_TRELLO_CLOSE_POP_OVER_BTN);
    let event = new Event("click", { bubbles: true });
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
            chrome.storage.local.set({ SELECTED_ITEM: i }, function() {});
        }
    }
}

function addObservers() {
    let pop_over = document.querySelector(Selectors.ZM_TRELLO_POP_OVER);
    if (pop_over) {
        const observer = new MutationObserver(function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    addContextMenu();
                }
            }
        });
        observer.observe(pop_over, config);
    }
    let board = document.getElementById('board');
    if (board) {
        const board_observer = new MutationObserver(function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    addEventListenerForListButton();
                }
            }
        });
        board_observer.observe(board, config);
    }
    let window_overlay = document.querySelector(Selectors.ZM_TRELLO_WINDOW_OVERLAY);
    if (window_overlay) {
        const window_overlay_observer = new MutationObserver(function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    updateBackground();
                }
            }
        });
        window_overlay_observer.observe(window_overlay, config);
    }
}

//func for hide or show columns on the board
function typeColumns(show) {
    let list_wrappers = document.getElementsByClassName(Selectors.ZM_TRELLO_LIST_CONTENT);
    for (let item of list_wrappers) {
        if (show) {
            item.classList.add('show_column');
        } else {
            item.classList.remove('show_column');
        }
    }
}

//get local storage data
chrome.storage.local.get({ TRELLO_STATUS: true, HIDE_COLUMNS: true, SELECTED_ITEM: -1 }, function(value) {
    trelloStatus = value.TRELLO_STATUS;
    isHideColumn = value.HIDE_COLUMNS;
    selectedColumn = value.SELECTED_ITEM;
    initStorage = true;
});

const observer = new MutationObserver(async(mutations) => {
    mutations
        .filter(mutation => mutation.type === 'childList')
        .forEach(mutation => {

            if (!isAddedIcon && document.getElementById('header') && initStorage) {
                addIcon(trelloStatus);
                isAddedIcon = true;
            }
            if (!enabledObservers && document.getElementById('board')) {

                //if we get data from local storage
                if (initStorage) {
                    //add observers for columns and icon zen mode
                    addObservers();

                    //if one columns should be showing
                    if (!isHideColumn && (selectedColumn > -1)) {
                        let list_wrappers = document.getElementsByClassName(Selectors.ZM_TRELLO_LIST_CONTENT);
                        list_wrappers[selectedColumn].classList.add('selected-column');
                        for (let item of list_wrappers) {
                            if (item.classList.contains('selected-column')) {
                                item.classList.add('show_column');
                            } else {
                                item.classList.remove('show_column');
                            }
                        }
                    } else {
                        //show all columns
                        typeColumns(true);
                    }

                    enabledObservers = true;

                }
            }
            if (isAddedIcon && enabledObservers) {
                observer.disconnect();
            }
        });
});

observer.observe(document.body, config);
