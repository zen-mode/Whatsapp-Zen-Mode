//console.log("in background script");
const DEFAULT_CONFIG = {
    shouldHide: false,
}

async function getAllRelevantTabs() {
    return promisify(chrome.tabs.query, {
        url: 'https://web.whatsapp.com/'
    });
}

async function toggleExtension() {
    const relevantTabs = await getAllRelevantTabs();
    const config = await getFromStorage('config');
    config.shouldHide = !config.shouldHide;
    if (config.shouldHide) {
        chrome.browserAction.setIcon({
            path: './images/icons/icon_off.png'
        });
        relevantTabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {action: 'hideSidebar'});
        });
    }
    else {   
        chrome.browserAction.setIcon({
            path: './images/icons/icon.png'
        });     
        relevantTabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {action: 'showSidebar'});
        });
    }
    saveToStorage('config', config);
}

chrome.runtime.onInstalled.addListener(async () => {
    //console.log("oninstalled run");
    const retrievedConfig = (await getFromStorage('config')) || {};
    const adjustedConfig = Object.assign({}, DEFAULT_CONFIG, retrievedConfig);
    await saveToStorage('config', adjustedConfig);
    chrome.browserAction.setIcon({
        path: adjustedConfig.shouldHide ? './images/icons/icon_off.png' : './images/icons/icon.png'
    });   

});

chrome.browserAction.onClicked.addListener(toggleExtension);

chrome.runtime.onMessage.addListener((message, sender, callback) => {
    if (message.action === 'toggleExtension') {
        toggleExtension();
    }
});