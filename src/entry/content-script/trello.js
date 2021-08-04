import {
    get_extn_storage_item_value,
    remove_extn_storage_item,
    set_extn_storage_item
} from "../../../utility-belt/helpers/extn/storage";

let trelloStatus = null;
let trelloIcon = null;
let trelloContextImg = null;
let trelloContextIcon = null;
let isAddedContextOptions = false;
let isOpenContext = false;
let isHideColumn = 'ON';
let selectedColumn = -1;

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
        document.querySelector('.window-overlay').style.backgroundColor = '#f4f5f7';
    }
    else {
        document.querySelector('.window-overlay').style.backgroundColor = 'rgba(0,0,0,.64)';
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
        trelloIcon.style.cursor = 'pointer';
        trelloIcon.style.marginRight = '3px';
        trelloIcon.src = chrome.runtime.getURL(`assets/logo/${status === 'ON' ? "logo.png" : "logo-off.png"}`);
        trelloIcon.addEventListener('click', handleIconClick);
        parent.prepend(trelloIcon);
    }
    else {
        console.log('no parent found');
    }
}

function addElementInContext(element) {
    let parent = document.querySelector('div.pop-over-content');
    if (parent) {
        let pop_over_list = document.getElementsByClassName('pop-over-list');
        let parent_div = pop_over_list.item(pop_over_list.length - 1).parentElement;
        if (parent_div) {
            parent_div.append(element);
        }
    }
}

function addContextMenu() {
    if (!isAddedContextOptions) {
        let stripCutter = document.createElement('hr');
        addElementInContext(stripCutter);
        trelloContextImg = new window.Image();
        trelloContextImg.classList.add('zen-mode-trello-context-icon');
        trelloContextImg.style.marginLeft = '3px';
        trelloContextImg.style.width = '22px';

        trelloContextImg.src = chrome.runtime.getURL(`assets/logo/${trelloStatus === 'ON' ? "logo.png" : "logo-off.png"}`);
        trelloContextIcon = document.createElement('ul');
        let li_item = document.createElement('li');
        li_item.style.display = 'flex';
        li_item.style.alignItems = 'center';
        li_item.style.cursor = 'pointer';
        li_item.style.margin = '10px 0';
        li_item.textContent = 'Zen Mode';
        li_item.addEventListener('click', handleIconClick);
        li_item.appendChild(trelloContextImg);
        trelloContextIcon.appendChild(li_item);
        let hideOption = document.createElement('li');
        hideOption.style.cursor = 'pointer';
        hideOption.addEventListener('click', hideOrShowColumnOption);
        if (isHideColumn === 'ON') {
            hideOption.innerText = 'Hide other columns';
        } else {
            hideOption.innerText = 'Show other columns';
        }
        trelloContextIcon.appendChild(hideOption);
        addElementInContext(trelloContextIcon);

        isAddedContextOptions = true;
    }

}

function hideOrShowColumnOption() {
    let list_wrappers = document.getElementsByClassName('list-wrapper');
    if (isHideColumn === 'ON') {
        for (let item of list_wrappers) {
            if (!item.classList.contains('selected-column')) {
                item.style.display = 'none';
            }
        }
    } else {
        for (let item of list_wrappers) {
            if (!item.classList.contains('selected-column')) {
                item.style.display = 'inline-block';
            }
        }
    }
    isHideColumn = isHideColumn === 'ON' ? 'OFF' : 'ON';
    set_extn_storage_item({ HIDE_COLUMNS: isHideColumn });
    hidePopOver();
}

function checkPopOver() {
    let parent = document.querySelector('div.pop-over-content');
    if (parent) {
        isOpenContext = true;
    } else {
        isOpenContext = false;
        isAddedContextOptions = false;
    }
}

function hidePopOver() {
    let pop_over_close_btn = document.querySelector('a.pop-over-header-close-btn');
    let event = new Event("click", {bubbles: true});
    pop_over_close_btn.dispatchEvent(event);
}

function addEventListenerForListButton() {
    let button_list = document.getElementsByClassName('list-header-extras');
    for (let item of button_list) {
        item.addEventListener('click', function() {
            removeSelectedColumns();
            let parent = this.parentElement.parentElement.parentElement;
            parent.classList.add('selected-column');
            checkSelectedIndex();
            isAddedContextOptions = false;
            setTimeout(addContextMenu, 500);
        });
    }
}

function removeSelectedColumns() {
    let list_wrappers = document.getElementsByClassName('list-wrapper');
    for (let item of list_wrappers) {
        if (item.classList.contains('selected-column')) {
            item.classList.remove('selected-column');
        }
    }
}

function checkSelectedIndex() {
    let list_wrappers = document.getElementsByClassName('list-wrapper');
    for (let i = 0; i < list_wrappers.length; i++) {
        if (list_wrappers[i].classList.contains('selected-column')) {
            set_extn_storage_item({ SELECTED_ITEM: i });
        }
    }
}

async function init() {
    trelloStatus = await get_extn_storage_item_value('TRELLO_STATUS') || 'ON';
    isHideColumn = await get_extn_storage_item_value('HIDE_COLUMNS') || 'ON';
    selectedColumn = await get_extn_storage_item_value('SELECTED_ITEM');
    if (typeof selectedColumn === 'undefined') {
        selectedColumn = -1;
    }
    addIcon(trelloStatus);
    addEventListenerForListButton(trelloStatus);

    if (selectedColumn > -1 && isHideColumn === 'OFF') {
        let list_wrappers = document.getElementsByClassName('list-wrapper');
        list_wrappers[selectedColumn].classList.add('selected-column');
        for (let item of list_wrappers) {
            if (!item.classList.contains('selected-column')) {
                item.style.display = 'none';
            }
        }
    }
}

//window.setInterval(addContextMenu, 250);
window.setInterval(checkPopOver, 250);
window.setInterval(updateBackground, 500);
window.setTimeout(init, 2000);