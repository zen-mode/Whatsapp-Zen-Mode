//console.log('in content script');
let zenModeOn = null;
let iconUpdaterInterval = null;

// this will only happen at the beginning, and only if zenMode is off
iconUpdaterInterval = window.setInterval(() => {
    if (!zenModeOn) {
        //console.log('updating current favicon...');
        window.postMessage({
            action: 'updateCurrentFavicon'
        }, '*');
    }
}, 500);

function showSidebar() {
    const sidebar = document.querySelector('#side');
    sidebar.parentElement.style.display = 'initial';
}

function hideSidebar() {
    const sidebar = document.querySelector('#side');
    sidebar.parentElement.style.display = 'none';
}

function updateExtensionIcon() {
    const icon = document.querySelector('.zen-mode-icon');
    if (icon) {
        icon.src = chrome.runtime.getURL(`images/icons/${zenModeOn ? 'icon_off.png' : 'icon.png'}`);
    }
}

function insertExtensionIcon() {
    const header = document.querySelector('#main header');
    if (header && !header.querySelector('.zen-mode-icon')) {
        const searchIcon = header.querySelector('[title="Search…"]') || header.childNodes[2].firstChild.firstChild.firstChild;
        const container = searchIcon.parentElement.parentElement;
        
        const extensionIcon = document.createElement('img');
        extensionIcon.src = chrome.runtime.getURL(`images/icons/${zenModeOn ? 'icon_off.png' : 'icon.png'}`);
        extensionIcon.classList.add('zen-mode-icon');
        extensionIcon.style.marginRight = '10px';
        extensionIcon.style.width = '25px';
        extensionIcon.style.cursor = 'pointer';
        extensionIcon.title = 'Zen Mode';
        extensionIcon.addEventListener('click', handleExtensionIconClick);
        container.prepend(extensionIcon);
    }
}

function handleExtensionIconClick() {
    chrome.runtime.sendMessage({ action: 'toggleExtension' });
}

async function init() {
    const config = await getFromStorage('config');
    await waitForElement('#side');
    if (config.shouldHide) {
        changeZenMode('on', true);
    }
    else {
        changeZenMode('off', true);
    }
    embed(runEmbedded);
    window.setInterval(insertExtensionIcon, 500);
}

function changeZenMode(onOrOff, initial = false) {
    if (onOrOff === 'on') {
        zenModeOn = true;
        hideSidebar();
    }
    else if (onOrOff === 'off') {
        zenModeOn = false;
        showSidebar();
    }
    else {
        //console.log('wrong parameter');
    }
    if (!initial) {
        window.postMessage({
            action: 'zenModeOn',
            data: zenModeOn,
        }, '*');
    }
    updateExtensionIcon();
}

function runEmbedded() {
    const regularIconURL = 'https://web.whatsapp.com/img/favicon_c5088e888c97ad440a61d247596f88e5.png';
    const originalAppendFunc = document.head.appendChild;
    let currentTitle = document.title;
    let currentFaviconURL = null;
    let faviconBypass = false;

    currentFaviconURL = readFaviconURL();
    if (zenModeOn) {
        document.title = 'WhatsApp';
        defineCustomTitleProperty();
        setFavicon(regularIconURL);
    }
    
    document.head.appendChild = function (el) {
        if (zenModeOn && el.id === 'favicon') {
            if (!faviconBypass) {
                currentFaviconURL = el.href;
                debugger
                if (el.href !== regularIconURL) {
                    return;
                }
            }
        }
        return originalAppendFunc.call(document.head, el);
    }
    
    function setFavicon(url) {
        const faviconLink = document.querySelector('#favicon');
        faviconLink && faviconLink.remove();
        const newFavicon = document.createElement("link");
        newFavicon.setAttribute("id", "favicon"),
        newFavicon.setAttribute("rel", "shortcut icon"),
        newFavicon.setAttribute("type", "image/png"),
        newFavicon.setAttribute("href", url),
        newFavicon.setAttribute("src", url);
        faviconBypass = true;
        document.head.appendChild(newFavicon);
        faviconBypass = false;
    }

    function defineCustomTitleProperty() {
        Object.defineProperty(document, "title", {
            configurable: true,
            enumerable: true,
            writable: true
        });
    }

    function messageHandler(e) {
        if (e.data.action === 'zenModeOn') {
            zenModeOn = e.data.data;
            if (zenModeOn) {
                currentTitle = document.title;
                document.title = 'WhatsApp';
                defineCustomTitleProperty();
                setFavicon(regularIconURL);
            }
            else {
                const recentTitle = document.title;
                delete document.title;
                document.title = recentTitle || currentTitle;
                    setFavicon(currentFaviconURL);
                }
            }
        else if (e.data.action === 'updateCurrentFavicon') {
            currentFaviconURL = readFaviconURL();
        }
    }

    function readFaviconURL() {
        const faviconLink = document.querySelector('#favicon'); 
        return faviconLink.href;
    }

    window.addEventListener("message", messageHandler, false);
}

function embed(fn) {
    const script = document.createElement("script");
    script.text = `(function(){let zenModeOn=${zenModeOn};(${fn.toString()})()})();`;
    document.documentElement.appendChild(script);
}

chrome.runtime.onMessage.addListener(message => {
    if (message.action === 'hideSidebar') {
        changeZenMode('on');
    }
    else if (message.action === 'showSidebar') {
        changeZenMode('off');
    }
    else {

    }
});

init();