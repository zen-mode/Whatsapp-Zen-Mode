function sendMessageAsync(message) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(message, resolve);
    });
}

function getFromStorage(key, storageType = 'local') {
    return new Promise((resolve, reject) => {
        chrome.storage[storageType].get(key, data => {
            resolve(data && data[key]);
        });
    });
}

function saveToStorage(key, dataToSave, storageType = 'local') {
    return new Promise((resolve, reject) => {
        const objectToSave = {};
        objectToSave[key] = dataToSave;
        chrome.storage[storageType].set(objectToSave, resolve);
    });
}

const waitForElement = (selector, interval = 50) => new Promise((resolve, reject) => {
    const t0 = performance.now();
    const intervalRef = window.setInterval(() => {
        const elementSought = document.querySelector(selector);
        if (elementSought) {
            window.clearInterval(intervalRef);
            resolve(elementSought);
        }
        if (performance.now() > t0 + 40 * 60 * 1000) {
            window.clearInterval(intervalRef);
            reject('Timeout. Selector was not found.');
        }
    }, interval);
});

function promisify(fn, args) {
    return new Promise((resolve, reject) => { 
        try {
            let argumentsList;
            if (args === undefined) {
                argumentsList = [];
            }
            else if (args instanceof Array) {
                argumentsList = args;
            }
            else {
                argumentsList = [args];
            }
            fn.apply(null, [...argumentsList, resolve]);   
        }
        catch (e) {
            reject('fn.apply failed');
        }
    });
}