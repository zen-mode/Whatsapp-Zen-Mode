// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function() {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"1EjNG":[function(require,module,exports) {
require("../../features/state-machine/state-machine-cs");
require("../../features/extension-can/display-zen-mode-ui/attach-zen-mode-ui");
require("../../features/state-machine/attach-DOM-observers");
// Explain: https://github.com/parcel-bundler/parcel/issues/5865.
// import "../../features/extension-can/display-zen-mode-ui/zen-mode-ui.css";
let zenModeOn = null;
let iconUpdaterInterval = null;
return;
// function updateExtensionIcon() {
// const icon = document.querySelector(".zen-mode-icon");
// if (icon) {
// icon.src = chrome.runtime.getURL(
// `images/icons/${zenModeOn ? "logo-off.png" : "logo.png"}`,
// );
// }
// }
function runEmbedded() {
  const regularIconURL = "https://web.whatsapp.com/img/favicon_c5088e888c97ad440a61d247596f88e5.png";
  const originalAppendFunc = document.head.appendChild;
  let currentTitle = document.title;
  let currentFaviconURL = null;
  let faviconBypass = false;
  currentFaviconURL = readFaviconURL();
  if (zenModeOn) {
    document.title = "WhatsApp";
    defineCustomTitleProperty();
    setFavicon(regularIconURL);
  }
  document.head.appendChild = function (el) {
    if (zenModeOn && el.id === "favicon") {
      if (!faviconBypass) {
        currentFaviconURL = el.href;
        debugger;

        if (el.href !== regularIconURL) {
          return;
        }
      }
    }
    return originalAppendFunc.call(document.head, el);
  };
  function setFavicon(url) {
    const faviconLink = document.querySelector("#favicon");
    faviconLink && faviconLink.remove();
    const newFavicon = document.createElement("link");
    (newFavicon.setAttribute("id", "favicon"), newFavicon.setAttribute("rel", "shortcut icon"), newFavicon.setAttribute("type", "image/png"), newFavicon.setAttribute("href", url), newFavicon.setAttribute("src", url));
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
    if (e.data.action === "zenModeOn") {
      zenModeOn = e.data.data;
      if (zenModeOn) {
        currentTitle = document.title;
        document.title = "WhatsApp";
        defineCustomTitleProperty();
        setFavicon(regularIconURL);
      } else {
        const recentTitle = document.title;
        delete document.title;
        document.title = recentTitle || currentTitle;
        setFavicon(currentFaviconURL);
      }
    } else if (e.data.action === "updateCurrentFavicon") {
      currentFaviconURL = readFaviconURL();
    }
  }
  function readFaviconURL() {
    const faviconLink = document.querySelector("#favicon");
    return faviconLink.href;
  }
  window.addEventListener("message", messageHandler, false);
}
function embed(fn) {
  const script = document.createElement("script");
  script.text = `(function(){let zenModeOn=${zenModeOn};(${fn.toString()})()})();`;
  document.documentElement.appendChild(script);
}

},{"../../features/state-machine/state-machine-cs":"2mqw2","../../features/extension-can/display-zen-mode-ui/attach-zen-mode-ui":"4V9E9","../../features/state-machine/attach-DOM-observers":"32Tll"}],"2mqw2":[function(require,module,exports) {
var _webextensionPolyfillTs = require("webextension-polyfill-ts");
var _utilityBeltHelpersDebugDevprint = require("../../../utility-belt/helpers/debug/devprint");
var _userCanToggleZenModeCsToggleZenMode = require("../user-can/toggle-zen-mode/cs/toggle-zen-mode");
var _dataDictionary = require("../../data/dictionary");
_utilityBeltHelpersDebugDevprint.devprint("STATUS: Waiting for TOGGLE_ZEN_MODE command.");
// 1. Waits for a command to toggle Zen mode to arrive from BGS SM.
_webextensionPolyfillTs.browser.runtime.onMessage.addListener(async command => {
  if (command.action !== _dataDictionary.Commands.TOGGLE_ZEN_MODE) return;
  // 2. Toggles Zen mode.
  void _userCanToggleZenModeCsToggleZenMode.toggle_Zen_mode();
});

},{"webextension-polyfill-ts":"4MjDP","../../../utility-belt/helpers/debug/devprint":"4rC6r","../user-can/toggle-zen-mode/cs/toggle-zen-mode":"1rzXO","../../data/dictionary":"7dDhZ"}],"4MjDP":[function(require,module,exports) {
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.browser = require("webextension-polyfill");

},{"webextension-polyfill":"4cghM"}],"4cghM":[function(require,module,exports) {
var define;
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("webextension-polyfill", ["module"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.browser = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (module) {
  /*webextension-polyfill - v0.7.0 - Tue Nov 10 2020 20:24:04*/
  /*-*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*-*/
  /*vim: set sts=2 sw=2 et tw=80:*/
  /*This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/.*/
  "use strict";
  if (typeof browser === "undefined" || Object.getPrototypeOf(browser) !== Object.prototype) {
    const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";
    const SEND_RESPONSE_DEPRECATION_WARNING = "Returning a Promise is the preferred way to send a reply from an onMessage/onMessageExternal listener, as the sendResponse will be removed from the specs (See https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)";
    // Wrapping the bulk of this polyfill in a one-time-use function is a minor
    // optimization for Firefox. Since Spidermonkey does not fully parse the
    // contents of a function until the first time it's called, and since it will
    // never actually need to be called, this allows the polyfill to be included
    // in Firefox nearly for free.
    const wrapAPIs = extensionAPIs => {
      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
      // at build time by replacing the following "include" with the content of the
      // JSON file.
      const apiMetadata = {
        "alarms": {
          "clear": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "clearAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "get": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "bookmarks": {
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getChildren": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getRecent": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getSubTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTree": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "browserAction": {
          "disable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "enable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "getBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getBadgeText": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "openPopup": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setBadgeText": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "browsingData": {
          "remove": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "removeCache": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCookies": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeDownloads": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFormData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeHistory": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeLocalStorage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePasswords": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePluginData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "settings": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "commands": {
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "contextMenus": {
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "cookies": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAllCookieStores": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "set": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "devtools": {
          "inspectedWindow": {
            "eval": {
              "minArgs": 1,
              "maxArgs": 2,
              "singleCallbackArg": false
            }
          },
          "panels": {
            "create": {
              "minArgs": 3,
              "maxArgs": 3,
              "singleCallbackArg": true
            },
            "elements": {
              "createSidebarPane": {
                "minArgs": 1,
                "maxArgs": 1
              }
            }
          }
        },
        "downloads": {
          "cancel": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "download": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "erase": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFileIcon": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "open": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "pause": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFile": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "resume": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "extension": {
          "isAllowedFileSchemeAccess": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "isAllowedIncognitoAccess": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "history": {
          "addUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "deleteRange": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getVisits": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "i18n": {
          "detectLanguage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAcceptLanguages": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "identity": {
          "launchWebAuthFlow": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "idle": {
          "queryState": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "management": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getSelf": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setEnabled": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "uninstallSelf": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "notifications": {
          "clear": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPermissionLevel": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "pageAction": {
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "hide": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "permissions": {
          "contains": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "request": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "runtime": {
          "getBackgroundPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPlatformInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "openOptionsPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "requestUpdateCheck": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "sendMessage": {
            "minArgs": 1,
            "maxArgs": 3
          },
          "sendNativeMessage": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "setUninstallURL": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "sessions": {
          "getDevices": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getRecentlyClosed": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "restore": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "storage": {
          "local": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          },
          "managed": {
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            }
          },
          "sync": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          }
        },
        "tabs": {
          "captureVisibleTab": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "detectLanguage": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "discard": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "duplicate": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "executeScript": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getZoom": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getZoomSettings": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goBack": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goForward": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "highlight": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "insertCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "query": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "reload": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "sendMessage": {
            "minArgs": 2,
            "maxArgs": 3
          },
          "setZoom": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "setZoomSettings": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "update": {
            "minArgs": 1,
            "maxArgs": 2
          }
        },
        "topSites": {
          "get": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "webNavigation": {
          "getAllFrames": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFrame": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "webRequest": {
          "handlerBehaviorChanged": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "windows": {
          "create": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getLastFocused": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        }
      };
      if (Object.keys(apiMetadata).length === 0) {
        throw new Error("api-metadata.json has not been included in browser-polyfill");
      }
      /**
      * A WeakMap subclass which creates and stores a value for any key which does
      * not exist when accessed, but behaves exactly as an ordinary WeakMap
      * otherwise.
      *
      * @param {function} createItem
      *        A function which will be called in order to create the value for any
      *        key which does not exist, the first time it is accessed. The
      *        function receives, as its only argument, the key being created.
      */
      class DefaultWeakMap extends WeakMap {
        constructor(createItem, items = undefined) {
          super(items);
          this.createItem = createItem;
        }
        get(key) {
          if (!this.has(key)) {
            this.set(key, this.createItem(key));
          }
          return super.get(key);
        }
      }
      /**
      * Returns true if the given object is an object with a `then` method, and can
      * therefore be assumed to behave as a Promise.
      *
      * @param {*} value The value to test.
      * @returns {boolean} True if the value is thenable.
      */
      const isThenable = value => {
        return value && typeof value === "object" && typeof value.then === "function";
      };
      /**
      * Creates and returns a function which, when called, will resolve or reject
      * the given promise based on how it is called:
      *
      * - If, when called, `chrome.runtime.lastError` contains a non-null object,
      *   the promise is rejected with that value.
      * - If the function is called with exactly one argument, the promise is
      *   resolved to that value.
      * - Otherwise, the promise is resolved to an array containing all of the
      *   function's arguments.
      *
      * @param {object} promise
      *        An object containing the resolution and rejection functions of a
      *        promise.
      * @param {function} promise.resolve
      *        The promise's resolution function.
      * @param {function} promise.rejection
      *        The promise's rejection function.
      * @param {object} metadata
      *        Metadata about the wrapped method which has created the callback.
      * @param {integer} metadata.maxResolvedArgs
      *        The maximum number of arguments which may be passed to the
      *        callback created by the wrapped async function.
      *
      * @returns {function}
      *        The generated callback function.
      */
      const makeCallback = (promise, metadata) => {
        return (...callbackArgs) => {
          if (extensionAPIs.runtime.lastError) {
            promise.reject(extensionAPIs.runtime.lastError);
          } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
            promise.resolve(callbackArgs[0]);
          } else {
            promise.resolve(callbackArgs);
          }
        };
      };
      const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";
      /**
      * Creates a wrapper function for a method with the given name and metadata.
      *
      * @param {string} name
      *        The name of the method which is being wrapped.
      * @param {object} metadata
      *        Metadata about the method being wrapped.
      * @param {integer} metadata.minArgs
      *        The minimum number of arguments which must be passed to the
      *        function. If called with fewer than this number of arguments, the
      *        wrapper will raise an exception.
      * @param {integer} metadata.maxArgs
      *        The maximum number of arguments which may be passed to the
      *        function. If called with more than this number of arguments, the
      *        wrapper will raise an exception.
      * @param {integer} metadata.maxResolvedArgs
      *        The maximum number of arguments which may be passed to the
      *        callback created by the wrapped async function.
      *
      * @returns {function(object, ...*)}
      *       The generated wrapper function.
      */
      const wrapAsyncFunction = (name, metadata) => {
        return function asyncFunctionWrapper(target, ...args) {
          if (args.length < metadata.minArgs) {
            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
          }
          if (args.length > metadata.maxArgs) {
            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
          }
          return new Promise((resolve, reject) => {
            if (metadata.fallbackToNoCallback) {
              // This API method has currently no callback on Chrome, but it return a promise on Firefox,
              // and so the polyfill will try to call it with a callback first, and it will fallback
              // to not passing the callback if the first call fails.
              try {
                target[name](...args, makeCallback({
                  resolve,
                  reject
                }, metadata));
              } catch (cbError) {
                console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);
                target[name](...args);
                // Update the API method metadata, so that the next API calls will not try to
                // use the unsupported callback anymore.
                metadata.fallbackToNoCallback = false;
                metadata.noCallback = true;
                resolve();
              }
            } else if (metadata.noCallback) {
              target[name](...args);
              resolve();
            } else {
              target[name](...args, makeCallback({
                resolve,
                reject
              }, metadata));
            }
          });
        };
      };
      /**
      * Wraps an existing method of the target object, so that calls to it are
      * intercepted by the given wrapper function. The wrapper function receives,
      * as its first argument, the original `target` object, followed by each of
      * the arguments passed to the original method.
      *
      * @param {object} target
      *        The original target object that the wrapped method belongs to.
      * @param {function} method
      *        The method being wrapped. This is used as the target of the Proxy
      *        object which is created to wrap the method.
      * @param {function} wrapper
      *        The wrapper function which is called in place of a direct invocation
      *        of the wrapped method.
      *
      * @returns {Proxy<function>}
      *        A Proxy object for the given method, which invokes the given wrapper
      *        method in its place.
      */
      const wrapMethod = (target, method, wrapper) => {
        return new Proxy(method, {
          apply(targetMethod, thisObj, args) {
            return wrapper.call(thisObj, target, ...args);
          }
        });
      };
      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);
      /**
      * Wraps an object in a Proxy which intercepts and wraps certain methods
      * based on the given `wrappers` and `metadata` objects.
      *
      * @param {object} target
      *        The target object to wrap.
      *
      * @param {object} [wrappers = {}]
      *        An object tree containing wrapper functions for special cases. Any
      *        function present in this object tree is called in place of the
      *        method in the same location in the `target` object tree. These
      *        wrapper methods are invoked as described in {@see wrapMethod}.
      *
      * @param {object} [metadata = {}]
      *        An object tree containing metadata used to automatically generate
      *        Promise-based wrapper functions for asynchronous. Any function in
      *        the `target` object tree which has a corresponding metadata object
      *        in the same location in the `metadata` tree is replaced with an
      *        automatically-generated wrapper function, as described in
      *        {@see wrapAsyncFunction}
      *
      * @returns {Proxy<object>}
      */
      const wrapObject = (target, wrappers = {}, metadata = {}) => {
        let cache = Object.create(null);
        let handlers = {
          has(proxyTarget, prop) {
            return (prop in target) || (prop in cache);
          },
          get(proxyTarget, prop, receiver) {
            if ((prop in cache)) {
              return cache[prop];
            }
            if (!((prop in target))) {
              return undefined;
            }
            let value = target[prop];
            if (typeof value === "function") {
              // This is a method on the underlying object. Check if we need to do
              // any wrapping.
              if (typeof wrappers[prop] === "function") {
                // We have a special-case wrapper for this method.
                value = wrapMethod(target, target[prop], wrappers[prop]);
              } else if (hasOwnProperty(metadata, prop)) {
                // This is an async method that we have metadata for. Create a
                // Promise wrapper for it.
                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                value = wrapMethod(target, target[prop], wrapper);
              } else {
                // This is a method that we don't know or care about. Return the
                // original method, bound to the underlying object.
                value = value.bind(target);
              }
            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
              // This is an object that we need to do some wrapping for the children
              // of. Create a sub-object wrapper for it with the appropriate child
              // metadata.
              value = wrapObject(value, wrappers[prop], metadata[prop]);
            } else if (hasOwnProperty(metadata, "*")) {
              // Wrap all properties in * namespace.
              value = wrapObject(value, wrappers[prop], metadata["*"]);
            } else {
              // We don't need to do any wrapping for this property,
              // so just forward all access to the underlying object.
              Object.defineProperty(cache, prop, {
                configurable: true,
                enumerable: true,
                get() {
                  return target[prop];
                },
                set(value) {
                  target[prop] = value;
                }
              });
              return value;
            }
            cache[prop] = value;
            return value;
          },
          set(proxyTarget, prop, value, receiver) {
            if ((prop in cache)) {
              cache[prop] = value;
            } else {
              target[prop] = value;
            }
            return true;
          },
          defineProperty(proxyTarget, prop, desc) {
            return Reflect.defineProperty(cache, prop, desc);
          },
          deleteProperty(proxyTarget, prop) {
            return Reflect.deleteProperty(cache, prop);
          }
        };
        // Per contract of the Proxy API, the "get" proxy handler must return the
        // original value of the target if that value is declared read-only and
        // non-configurable. For this reason, we create an object with the
        // prototype set to `target` instead of using `target` directly.
        // Otherwise we cannot return a custom object for APIs that
        // are declared read-only and non-configurable, such as `chrome.devtools`.
        // 
        // The proxy handlers themselves will still use the original `target`
        // instead of the `proxyTarget`, so that the methods and properties are
        // dereferenced via the original targets.
        let proxyTarget = Object.create(target);
        return new Proxy(proxyTarget, handlers);
      };
      /**
      * Creates a set of wrapper functions for an event object, which handles
      * wrapping of listener functions that those messages are passed.
      *
      * A single wrapper is created for each listener function, and stored in a
      * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
      * retrieve the original wrapper, so that  attempts to remove a
      * previously-added listener work as expected.
      *
      * @param {DefaultWeakMap<function, function>} wrapperMap
      *        A DefaultWeakMap object which will create the appropriate wrapper
      *        for a given listener function when one does not exist, and retrieve
      *        an existing one when it does.
      *
      * @returns {object}
      */
      const wrapEvent = wrapperMap => ({
        addListener(target, listener, ...args) {
          target.addListener(wrapperMap.get(listener), ...args);
        },
        hasListener(target, listener) {
          return target.hasListener(wrapperMap.get(listener));
        },
        removeListener(target, listener) {
          target.removeListener(wrapperMap.get(listener));
        }
      });
      // Keep track if the deprecation warning has been logged at least once.
      let loggedSendResponseDeprecationWarning = false;
      const onMessageWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }
        /**
        * Wraps a message listener function so that it may send responses based on
        * its return value, rather than by returning a sentinel value and calling a
        * callback. If the listener function returns a Promise, the response is
        * sent when the promise either resolves or rejects.
        *
        * @param {*} message
        *        The message sent by the other end of the channel.
        * @param {object} sender
        *        Details about the sender of the message.
        * @param {function(*)} sendResponse
        *        A callback which, when called with an arbitrary argument, sends
        *        that value as a response.
        * @returns {boolean}
        *        True if the wrapped listener returned a Promise, which will later
        *        yield a response. False otherwise.
        */
        return function onMessage(message, sender, sendResponse) {
          let didCallSendResponse = false;
          let wrappedSendResponse;
          let sendResponsePromise = new Promise(resolve => {
            wrappedSendResponse = function (response) {
              if (!loggedSendResponseDeprecationWarning) {
                console.warn(SEND_RESPONSE_DEPRECATION_WARNING, new Error().stack);
                loggedSendResponseDeprecationWarning = true;
              }
              didCallSendResponse = true;
              resolve(response);
            };
          });
          let result;
          try {
            result = listener(message, sender, wrappedSendResponse);
          } catch (err) {
            result = Promise.reject(err);
          }
          const isResultThenable = result !== true && isThenable(result);
          // If the listener didn't returned true or a Promise, or called
          // wrappedSendResponse synchronously, we can exit earlier
          // because there will be no response sent from this listener.
          if (result !== true && !isResultThenable && !didCallSendResponse) {
            return false;
          }
          // A small helper to send the message if the promise resolves
          // and an error if the promise rejects (a wrapped sendMessage has
          // to translate the message into a resolved promise or a rejected
          // promise).
          const sendPromisedResult = promise => {
            promise.then(msg => {
              // send the message value.
              sendResponse(msg);
            }, error => {
              // Send a JSON representation of the error if the rejected value
              // is an instance of error, or the object itself otherwise.
              let message;
              if (error && (error instanceof Error || typeof error.message === "string")) {
                message = error.message;
              } else {
                message = "An unexpected error occurred";
              }
              sendResponse({
                __mozWebExtensionPolyfillReject__: true,
                message
              });
            }).catch(err => {
              // Print an error on the console if unable to send the response.
              console.error("Failed to send onMessage rejected reply", err);
            });
          };
          // If the listener returned a Promise, send the resolved value as a
          // result, otherwise wait the promise related to the wrappedSendResponse
          // callback to resolve and send it as a response.
          if (isResultThenable) {
            sendPromisedResult(result);
          } else {
            sendPromisedResult(sendResponsePromise);
          }
          // Let Chrome know that the listener is replying.
          return true;
        };
      });
      const wrappedSendMessageCallback = ({reject, resolve}, reply) => {
        if (extensionAPIs.runtime.lastError) {
          // Detect when none of the listeners replied to the sendMessage call and resolve
          // the promise to undefined as in Firefox.
          // See https://github.com/mozilla/webextension-polyfill/issues/130
          if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
            resolve();
          } else {
            reject(extensionAPIs.runtime.lastError);
          }
        } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
          // Convert back the JSON representation of the error into
          // an Error instance.
          reject(new Error(reply.message));
        } else {
          resolve(reply);
        }
      };
      const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
        if (args.length < metadata.minArgs) {
          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
        }
        if (args.length > metadata.maxArgs) {
          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
        }
        return new Promise((resolve, reject) => {
          const wrappedCb = wrappedSendMessageCallback.bind(null, {
            resolve,
            reject
          });
          args.push(wrappedCb);
          apiNamespaceObj.sendMessage(...args);
        });
      };
      const staticWrappers = {
        runtime: {
          onMessage: wrapEvent(onMessageWrappers),
          onMessageExternal: wrapEvent(onMessageWrappers),
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 1,
            maxArgs: 3
          })
        },
        tabs: {
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 2,
            maxArgs: 3
          })
        }
      };
      const settingMetadata = {
        clear: {
          minArgs: 1,
          maxArgs: 1
        },
        get: {
          minArgs: 1,
          maxArgs: 1
        },
        set: {
          minArgs: 1,
          maxArgs: 1
        }
      };
      apiMetadata.privacy = {
        network: {
          "*": settingMetadata
        },
        services: {
          "*": settingMetadata
        },
        websites: {
          "*": settingMetadata
        }
      };
      return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
    };
    if (typeof chrome != "object" || !chrome || !chrome.runtime || !chrome.runtime.id) {
      throw new Error("This script should only be loaded in a browser extension.");
    }
    // The build process adds a UMD wrapper around this file, which makes the
    // `module` variable available.
    module.exports = wrapAPIs(chrome);
  } else {
    module.exports = browser;
  }
});

},{}],"4rC6r":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "devprint", function () {
  return devprint;
});
var _envEnv = require("../env/env");
// Make devprint global for ease of debugging - no need to import explicitly.
// todo-2: all globalThis assignments sd be dome through a helper
globalThis.devprint = devprint;
/**
* @description: Prints to console in dev environment; accepts optional indents
* @exampleInput: 'foo', 2
* @exampleOutput: console.log('  foo')
* @pure: false: depends on env_is, prints to console
* @hasTests: false
*/
const PrinterTypes = {
  LOG: "LOG",
  WARN: "WARN",
  ERROR: "ERROR"
};
function devprint(textToPrint, relatedObject, type, indentsNum) {
  if (!_envEnv.env_is.dev()) return;
  const printer = {
    [PrinterTypes.LOG]: console.log,
    [PrinterTypes.WARN]: console.warn,
    [PrinterTypes.ERROR]: console.error
  };
  if (!type) {
    // eslint-disable-next-line no-param-reassign
    type = PrinterTypes.LOG;
  }
  const tabs = indentsNum ? (" ").repeat(indentsNum) : "";
  // const tabs = indentsNum ? "\t".repeat(indentsNum) : ""; // Tabs
  relatedObject !== undefined ? printer[type](tabs + textToPrint, relatedObject) : printer[type](tabs + textToPrint);
}
/*eslint-disable functional/immutable-data*/
devprint.warn = function warn(text, obj) {
  return devprint(text, obj, PrinterTypes.WARN);
};
devprint.error = function error(text, obj) {
  return devprint(text, obj, PrinterTypes.ERROR);
};

},{"../env/env":"2V8Pr","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"2V8Pr":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "env_is", function () {
  return env_is;
});
var process = require("process");
const env_is = {
  prod: () => "production" === "production",
  dev: () => !env_is.prod(),
  webApp: () => !env_is.server() && !env_is.extn(),
  server: () => process && process.versions && !!process.versions.node,
  extn: () => env_is.extnBS() || env_is.extnCS(),
  extnBS: () => Boolean(chrome && chrome.permissions !== undefined),
  extnCS: () => Boolean(chrome && chrome.permissions === undefined && chrome.storage)
};
// eslint-disable-next-line functional/immutable-data
globalThis.Env = env_is;

},{"process":"2gEb2","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"2gEb2":[function(require,module,exports) {
// shim for using process in browser
var process = module.exports = {};
// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.
var cachedSetTimeout;
var cachedClearTimeout;
function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}
(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }
  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    // normal enviroments in sane situations
    return setTimeout(fun, 0);
  }
  // if setTimeout wasn't available but was latter defined
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    // normal enviroments in sane situations
    return clearTimeout(marker);
  }
  // if clearTimeout wasn't available but was latter defined
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }
  draining = false;
  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }
  if (queue.length) {
    drainQueue();
  }
}
function drainQueue() {
  if (draining) {
    return;
  }
  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;
  while (len) {
    currentQueue = queue;
    queue = [];
    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }
    queueIndex = -1;
    len = queue.length;
  }
  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}
process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }
  queue.push(new Item(fun, args));
  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
};
// v8 likes predictible objects
function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}
Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = '';
// empty string to avoid regexp issues
process.versions = {};
function noop() {}
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;
process.listeners = function (name) {
  return [];
};
process.binding = function (name) {
  throw new Error('process.binding is not supported');
};
process.cwd = function () {
  return '/';
};
process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};
process.umask = function () {
  return 0;
};

},{}],"5J4vU":[function(require,module,exports) {
"use strict";

exports.interopDefault = function (a) {
  return a && a.__esModule ? a : {
    default: a
  };
};

exports.defineInteropFlag = function (a) {
  Object.defineProperty(a, '__esModule', {
    value: true
  });
};

exports.exportAll = function (source, dest) {
  Object.keys(source).forEach(function (key) {
    if (key === 'default' || key === '__esModule') {
      return;
    } // Skip duplicate re-exports when they have the same value.


    if (key in dest && dest[key] === source[key]) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function () {
        return source[key];
      }
    });
  });
  return dest;
};

exports.export = function (dest, destName, get) {
  Object.defineProperty(dest, destName, {
    enumerable: true,
    get: get
  });
};
},{}],"1rzXO":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "toggle_Zen_mode", function () {
  return toggle_Zen_mode;
});
_parcelHelpers.export(exports, "toggle_Zen_mode_on_page", function () {
  return toggle_Zen_mode_on_page;
});
var _utilityBeltHelpersDebugDevprint = require("../../../../../utility-belt/helpers/debug/devprint");
var _utilityBeltHelpersExtnStorage = require("../../../../../utility-belt/helpers/extn/storage");
var _utilityBeltHelpersDomDOMShortcuts = require("../../../../../utility-belt/helpers/dom/DOM-shortcuts");
var _utilityBeltHelpersDomSetElStyle = require("../../../../../utility-belt/helpers/dom/set-el-style");
var _webextensionPolyfillTs = require("webextension-polyfill-ts");
var _extensionCanProcessErrorsProcessError = require("../../../extension-can/process-errors/process-error");
var _dataDictionary = require("../../../../data/dictionary");
_utilityBeltHelpersDebugDevprint.devprint("STATUS: Waiting for TOGGLE_ZEN_MODE command.");
async function toggle_Zen_mode() {
  // 1. Toggles Zen mode State.
  const showZenModeUI = await toggle_Zen_mode_State_AND_get_value();
  // 2. Toggles Zen mode UI on the page.
  if (showZenModeUI) toggle_Zen_mode_on_page(_dataDictionary.ZenModeStatuses.ON); else toggle_Zen_mode_on_page(_dataDictionary.ZenModeStatuses.OFF);
  _utilityBeltHelpersDebugDevprint.devprint(`STATUS: Zen Mode is ${showZenModeUI ? _dataDictionary.ZenModeStatuses.ON : _dataDictionary.ZenModeStatuses.OFF}`);
}
async function toggle_Zen_mode_State_AND_get_value() {
  const oldState = await _utilityBeltHelpersExtnStorage.get_extn_storage_item_value(_dataDictionary.StateItemNames.ZEN_MODE_STATUS);
  await _utilityBeltHelpersExtnStorage.set_extn_storage_item({
    [_dataDictionary.StateItemNames.ZEN_MODE_STATUS]: !oldState
  });
  _utilityBeltHelpersDebugDevprint.devprint(`STATUS: Set ${_dataDictionary.StateItemNames.ZEN_MODE_STATUS} State to:`, !oldState);
  return !oldState;
}
function toggle_Zen_mode_on_page(mode) {
  _utilityBeltHelpersDomSetElStyle.set_el_style(_utilityBeltHelpersDomDOMShortcuts.DOM.get_el(_dataDictionary.Selectors.ZM_TOGGLE_BUTTON), {
    "background-image": 'url("' + _webextensionPolyfillTs.browser.runtime.getURL(`assets/logo/${mode === _dataDictionary.ZenModeStatuses.ON ? "logo-off.png" : "logo.png"}` + '")')
  });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const sidebarEl = _utilityBeltHelpersDomDOMShortcuts.DOM.get_el(_dataDictionary.Selectors.WA_SIDEBAR);
  _utilityBeltHelpersDomSetElStyle.set_el_style(sidebarEl.parentElement, {
    display: mode === _dataDictionary.ZenModeStatuses.ON ? "none" : "initial"
  });
  // Note: That one's invisible by def, but still present in DOM.
  const contactInfoPanelEl = _utilityBeltHelpersDomDOMShortcuts.DOM.get_el(_dataDictionary.Selectors.WA_CONTACT_INFO_PANEL);
  if (!contactInfoPanelEl) {
    _extensionCanProcessErrorsProcessError.throw_DOM_error(_dataDictionary.Selectors.WA_CONTACT_INFO_PANEL, "WA_CONTACT_INFO_PANEL");
    return;
  }
  _utilityBeltHelpersDomSetElStyle.set_el_style(contactInfoPanelEl, {
    display: mode === _dataDictionary.ZenModeStatuses.ON ? "none" : "initial"
  });
}

},{"../../../../../utility-belt/helpers/debug/devprint":"4rC6r","../../../../../utility-belt/helpers/extn/storage":"h8TiD","../../../../../utility-belt/helpers/dom/DOM-shortcuts":"6BKmq","../../../../../utility-belt/helpers/dom/set-el-style":"5CnJN","webextension-polyfill-ts":"4MjDP","../../../extension-can/process-errors/process-error":"5AXKD","../../../../data/dictionary":"7dDhZ","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"h8TiD":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "set_extn_storage_item", function () {
  return set_extn_storage_item;
});
_parcelHelpers.export(exports, "get_extn_storage_item_value", function () {
  return get_extn_storage_item_value;
});
_parcelHelpers.export(exports, "remove_extn_storage_item", function () {
  return remove_extn_storage_item;
});
_parcelHelpers.export(exports, "clear_extn_storage", function () {
  return clear_extn_storage;
});
var _webextensionPolyfillTs = require("webextension-polyfill-ts");
async function set_extn_storage_item(item, sync = false) {
  if (sync) await _webextensionPolyfillTs.browser.storage.sync.set(item); else await _webextensionPolyfillTs.browser.storage.local.set(item);
}
async function get_extn_storage_item_value(itemKey, sync = false) {
  if (itemKey !== undefined) {
    const itemObject = sync ? await _webextensionPolyfillTs.browser.storage.sync.get(itemKey) : await _webextensionPolyfillTs.browser.storage.local.get(itemKey);
    return itemObject[itemKey];
  } else {
    const data = sync ? await _webextensionPolyfillTs.browser.storage.sync.get() : await _webextensionPolyfillTs.browser.storage.local.get();
    return data;
  }
}
async function remove_extn_storage_item(itemKey, sync = false) {
  if (sync) await _webextensionPolyfillTs.browser.storage.sync.remove(itemKey); else await _webextensionPolyfillTs.browser.storage.local.remove(itemKey);
}
async function clear_extn_storage(sync = false) {
  if (sync) await _webextensionPolyfillTs.browser.storage.sync.clear(); else await _webextensionPolyfillTs.browser.storage.local.clear();
}

},{"webextension-polyfill-ts":"4MjDP","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"6BKmq":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "DOM", function () {
  return DOM;
});
var _asyncWait = require("../async/wait");
var _isElVisible = require("./is-el-visible");
var _setElAttributes = require("./set-el-attributes");
const DOM = {
  /**
  * @description: Similar to document.body.querySelector; accepts parentEl arg.
  * @exampleInput:  "input" | "foo" | "foo", <someDiv/>
  * @exampleOutput: <input> | null | <span>foo</span>
  * @sideEffects: DOM traversal
  * @hasTests: no
  */
  /**
  * @description: Similar to document.body.querySelector; accepts parentEl arg.
  * @exampleInput:  "input" | "foo" | "foo", <someDiv/>
  * @exampleOutput: <input> | null | <span>foo</span>
  * @sideEffects: DOM traversal
  * @hasTests: no
  */
  create_el({attributes, html, tag, text}) {
    const element = document.createElement(tag);
    // Explain: Reassignment by design. Don't want null assert here. Dangerously set inner HTML by design.
    /*eslint-disable functional/immutable-data,@typescript-eslint/non-nullable-type-assertion-style*/
    // eslint-disable-next-line no-unsanitized/property
    if (Boolean(html)) element.innerHTML = html;
    if (Boolean(text)) element.innerText = text;
    /*eslint-enable functional/immutable-data,@typescript-eslint/non-nullable-type-assertion-style*/
    if (attributes) _setElAttributes.set_el_attributes(element, attributes);
    return element;
  },
  /**
  * @description: Similar to document.body.querySelector; accepts parentEl arg.
  * @exampleInput:  "input" | "foo" | "foo", <someDiv/>
  * @exampleOutput: <input> | null | <span>foo</span>
  * @sideEffects: DOM traversal
  * @hasTests: no
  */
  /**
  * @description: Similar to document.body.querySelector; accepts parentEl arg.
  * @exampleInput:  "input" | "foo" | "foo", <someDiv/>
  * @exampleOutput: <input> | null | <span>foo</span>
  * @sideEffects: DOM traversal
  * @hasTests: no
  */
  get_el(selector, parentEl = document.body) {
    return parentEl.querySelector(selector);
  },
  /**
  * @description: Similar to document.body.querySelectorAll; unless onlyVisible flag is set; accepts parentEl arg.
  * @exampleInput:  "input"                                  | "input", <someDiv/> | "input", <someDiv/>, true .
  * @exampleOutput: [<input>, <input style="display: none">] | [<input>]           | [] .
  * @sideEffects: DOM traversal.
  * @hasTests: no.
  */
  /**
  * @description: Similar to document.body.querySelectorAll; unless onlyVisible flag is set; accepts parentEl arg.
  * @exampleInput:  "input"                                  | "input", <someDiv/> | "input", <someDiv/>, true .
  * @exampleOutput: [<input>, <input style="display: none">] | [<input>]           | [] .
  * @sideEffects: DOM traversal.
  * @hasTests: no.
  */
  get_els(selector, parentEl = document.body, onlyVisible = false) {
    const elArray = [...parentEl.querySelectorAll(selector)];
    return onlyVisible ? elArray.filter(_isElVisible.is_el_visible) : elArray;
  },
  /**
  * @description: Checks if page has a given text string.
  * @exampleInput:  "foo"
  * @exampleOutput: true
  * @sideEffects: DOM traversal
  * @hasTests: no
  */
  /**
  * @description: Checks if page has a given text string.
  * @exampleInput:  "foo"
  * @exampleOutput: true
  * @sideEffects: DOM traversal
  * @hasTests: no
  */
  includes_text(text) {
    return document.body.innerText.includes(text);
  },
  /**
  * @description: Removes an El from DOM; returns true or false
  * @exampleInput:  "#element" (found in DOM) | "#element" (not found in DOM)
  * @exampleOutput: true                      | false
  * @sideEffects: DOM manipulation
  * @hasTests: no
  */
  /**
  * @description: Removes an El from DOM; returns true or false
  * @exampleInput:  "#element" (found in DOM) | "#element" (not found in DOM)
  * @exampleOutput: true                      | false
  * @sideEffects: DOM manipulation
  * @hasTests: no
  */
  remove_el(selector) {
    const el = DOM.get_el(selector);
    if (el) {
      el.remove();
      return true;
    }
    return false;
  },
  /**
  * @description: Looks for a selector in document body every {pollMs}; does this for ...
  *               {waitMs}. If within {waitMs} Element is found - returns Element; ...
  *               otherwise returns null.
  * @exampleInput:  ".foo"                  | '#non-existent'
  * @exampleOutput: <div class="foo"></div> | null
  * @sideEffects: DOM traversal
  * @hasTests: no
  */
  /**
  * @description: Looks for a selector in document body every {pollMs}; does this for ...
  *               {waitMs}. If within {waitMs} Element is found - returns Element; ...
  *               otherwise returns null.
  * @exampleInput:  ".foo"                  | '#non-existent'
  * @exampleOutput: <div class="foo"></div> | null
  * @sideEffects: DOM traversal
  * @hasTests: no
  */
  async wait_and_get_el(selector, waitMs = 3000, pollMs = 100) {
    return new Promise(resolve => {
      // Explain: This interval timer checks for the presence of Element every 100ms;
      // if found - resolves the promise with Element and clears overall timer.
      const intervalHandle = setInterval(() => {
        const el = DOM.get_el(selector);
        if (el) {
          clearInterval(intervalHandle);
          clearTimeout(timeoutHandle);
          resolve(el);
        }
      }, pollMs);
      // Explain: This overall timer waits for 3000ms; if by that time Element is not ...
      // found - resolves the promise with null and clears interval timer.
      const timeoutHandle = setTimeout(() => {
        clearInterval(intervalHandle);
        resolve(null);
      }, waitMs);
    });
  },
  async wait_to_include_text(text, waitMs, pollMs) {
    return _asyncWait.wait_for_fn_to_return_true(DOM.includes_text, [text], waitMs, pollMs);
  }
};

},{"../async/wait":"3O85N","./is-el-visible":"50xXJ","./set-el-attributes":"67U6e","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"3O85N":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "wait_for_ms", function () {
  return wait_for_ms;
});
_parcelHelpers.export(exports, "for_10ms", function () {
  return for_10ms;
});
_parcelHelpers.export(exports, "for_100ms", function () {
  return for_100ms;
});
_parcelHelpers.export(exports, "for_500ms", function () {
  return for_500ms;
});
_parcelHelpers.export(exports, "for_1sec", function () {
  return for_1sec;
});
_parcelHelpers.export(exports, "for_2sec", function () {
  return for_2sec;
});
_parcelHelpers.export(exports, "for_3sec", function () {
  return for_3sec;
});
_parcelHelpers.export(exports, "for_5sec", function () {
  return for_5sec;
});
_parcelHelpers.export(exports, "wait_for_fn_to_return_true", function () {
  return wait_for_fn_to_return_true;
});
async function wait_for_ms(time) {
  // prettier-ignore
  // eslint-disable-next-line promise/avoid-new
  return new Promise(resolve => setTimeout(resolve, time));
}
const for_10ms = async () => wait_for_ms(10);
const for_100ms = async () => wait_for_ms(100);
const for_500ms = async () => wait_for_ms(500);
const for_1sec = async () => wait_for_ms(1000);
const for_2sec = async () => wait_for_ms(2000);
const for_3sec = async () => wait_for_ms(3000);
const for_5sec = async () => wait_for_ms(5000);
async function wait_for_fn_to_return_true(fn, fnArgs, waitMs = 3000, pollMs = 100) {
  return new Promise(resolve => {
    // Explain: This interval timer checks for fn to return true every 100ms;
    // if found - resolves the promise with Element and clears overall timer.
    const intervalHandle = setInterval(() => {
      const result = fnArgs ? fn(...fnArgs) : fn();
      if (result) {
        clearInterval(intervalHandle);
        clearTimeout(timeoutHandle);
        resolve(true);
      }
    }, pollMs);
    // Explain: This overall timer waits for 3000ms; if by that time fn has not ...
    // returned true - resolves the promise with null and clears interval timer.
    const timeoutHandle = setTimeout(() => {
      clearInterval(intervalHandle);
      resolve(null);
    }, waitMs);
  });
}

},{"@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"50xXJ":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "is_el_visible", function () {
  return is_el_visible;
});
function is_el_visible(el) {
  return (
    // https://stackoverflow.com/a/33456469/4507580
    Boolean(el.offsetWidth || el.offsetHeight || el.getClientRects().length) && !isHiddenByCSS(el)
  );
}
function isHiddenByCSS(el) {
  return el.style.display === "none" || el.style.visibility === "hidden" || parseFloat(el.style.opacity) < 0.1;
}

},{"@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"67U6e":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "set_el_attributes", function () {
  return set_el_attributes;
});
function set_el_attributes(el, attributes) {
  Object.entries(attributes).forEach(entry => {
    // Explain: TS has incorrect typings for .setAttribute.
    // @ts-ignore
    el.setAttribute(...entry);
  });
  return el;
}

},{"@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"5CnJN":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "set_el_style", function () {
  return set_el_style;
});
function set_el_style(el, styleObj) {
  Object.entries(styleObj).forEach(entry => el.style.setProperty(...entry));
  return el;
}

},{"@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"5AXKD":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "process_error", function () {
  return process_error;
});
_parcelHelpers.export(exports, "throw_DOM_error", function () {
  return throw_DOM_error;
});
function process_error(errorOrErrorMessage) {
  // Explain: By design.
  // eslint-disable-next-line functional/no-throw-statement
  if (errorOrErrorMessage instanceof Error) throw errorOrErrorMessage;
  // Explain: By design.
  // eslint-disable-next-line no-console
  console.error(errorOrErrorMessage);
}
function throw_DOM_error(selector, selectorName) {
  process_error(Error(`Cannot find ${selectorName} ("${selector}") element. Check that its selector is in the DOM`));
}

},{"@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"7dDhZ":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "URLS", function () {
  return URLS;
});
_parcelHelpers.export(exports, "Commands", function () {
  return Commands;
});
_parcelHelpers.export(exports, "StateItemNames", function () {
  return StateItemNames;
});
_parcelHelpers.export(exports, "Selectors", function () {
  return Selectors;
});
_parcelHelpers.export(exports, "ZenDomDataAttributes", function () {
  return ZenDomDataAttributes;
});
_parcelHelpers.export(exports, "ZenModeStatuses", function () {
  return ZenModeStatuses;
});
const URLS = {
  FEEDBACK_EMAIL: "mailto:usezenmode@gmail.com",
  INTRO_PAGE: "https://google.com",
  PROXY: "https://cors-anywhere.herokuapp.com:443/"
};
var Commands;
(function (Commands) {
  Commands["TOGGLE_ZEN_MODE"] = "TOGGLE_ZEN_MODE";
})(Commands || (Commands = {}));
var StateItemNames;
(function (StateItemNames) {
  StateItemNames["HIDDEN_CONTACTS"] = "HIDDEN_CONTACTS";
  StateItemNames["SHOW_VERSION_NUM"] = "SHOW_VERSION_NUM";
  StateItemNames["ZEN_MODE_STATUS"] = "ZEN_MODE_STATUS";
})(StateItemNames || (StateItemNames = {}));
var Selectors;
(function (Selectors) {
  Selectors["WA_CONTACT_ELEMENT_HOVERED_DIV"] = ".hover";
  // Note: there are 2 regions; we need the 1st.
  Selectors["WA_CONTACT_LIST"] = "[role='region']";
  Selectors["WA_CONTACTS"] = "[role='region']:nth-of-type(1) > div";
  Selectors["WA_CONTACT_MUTED_ICON"] = "[data-icon=\"muted\"]";
  Selectors["WA_CONTACT_NAME"] = "[role='region'] [role='option'] [title][dir]";
  Selectors["WA_CONTACT_SECOND_DIV"] = "[role='option']";
  // Explain: WA ctx menu get rendered to dom only on RMB click. Since we need to use it's ..
  // class to style our own ctx menu - we have to hard code the name of the class.
  // WA_CONTACT_CTX_MENU = "#app span:nth-of-type(4) > div",
  // WA_CONTACT_CTX_MENU_LIST = "#app span:nth-of-type(4) > div ul",
  // WA_CONTACT_CTX_MENU_LIST_ITEM = "#app span:nth-of-type(4) > div ul li",
  // WA_CONTACT_CTX_MENU_ITEM_CONTENTS_DIV = "#app span:nth-of-type(4) > div ul [role='button']",
  Selectors["WA_CONTACT_CTX_MENU"] = "._1qAEq";
  Selectors["WA_CONTACT_CTX_MENU_LIST"] = "._19rjv";
  // Explain: Looks like it's not needed.
  // WA_CONTACT_CTX_MENU_LIST_ITEM = "_2iavx _2CDB7 _3UHfW",
  Selectors["WA_CONTACT_CTX_MENU_ITEM_CONTENTS_DIV"] = "._11srW, ._2xxet";
  Selectors["WA_CONTACT_INFO_PANEL"] = "#app > div > div > div:nth-of-type(2) > div:nth-of-type(1)";
  Selectors["WA_SIDEBAR"] = "#side";
  Selectors["WA_USER_NAVBAR"] = "#main header";
  Selectors["ZM_CTX_MENU"] = "#ZenMode__contextMenu";
  Selectors["ZM_CTX_MENU_ITEM"] = ".ZenMode__contextMenuItem";
  Selectors["ZM_HIDE_CONTACT_CTX_MENU_ITEM"] = "#ZenMode__hideContact";
  Selectors["ZM_RELEASE_NOTES_AREA"] = "#ZenMode__releaseNotes";
  Selectors["ZM_RELEASE_NOTES_AREA_CLOSE_BTN"] = "#ZenMode__releaseNotes__closeBtn";
  Selectors["ZM_RELEASE_NOTES_AREA_VERSION"] = "#ZenMode__releaseNotes__version";
  Selectors["ZM_TOGGLE_BUTTON"] = "#ZenMode__toggle";
  Selectors["ZM_TOGGLE_BUTTON_CHEVRON"] = "#ZenMode__toggle__chevron";
  Selectors["ZM_VERSION_NUMBER"] = "#ZenMode__version";
})(Selectors || (Selectors = {}));
var ZenDomDataAttributes;
(function (ZenDomDataAttributes) {
  ZenDomDataAttributes["contact-name"] = "zm-data-contact-name";
})(ZenDomDataAttributes || (ZenDomDataAttributes = {}));
var ZenModeStatuses;
(function (ZenModeStatuses) {
  ZenModeStatuses["ON"] = "ON";
  ZenModeStatuses["OFF"] = "OFF";
})(ZenModeStatuses || (ZenModeStatuses = {}));

},{"@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"4V9E9":[function(require,module,exports) {
var _utilityBeltHelpersDomDOMShortcuts = require("../../../../utility-belt/helpers/dom/DOM-shortcuts");
var _processErrorsProcessError = require("../process-errors/process-error");
var _utilityBeltHelpersExtnStorage = require("../../../../utility-belt/helpers/extn/storage");
var _utilityBeltHelpersDebugDevprint = require("../../../../utility-belt/helpers/debug/devprint");
var _constructZenModeUiConstructZenModeUi = require("./construct-zen-mode-ui/construct-zen-mode-ui");
var _userCanToggleZenModeCsToggleZenMode = require("../../user-can/toggle-zen-mode/cs/toggle-zen-mode");
var _dataDictionary = require("../../../data/dictionary");
var _utilityBeltConstantsTime = require("../../../../utility-belt/constants/time");
// 1. Sets an interval timer to attach Zen mode UI in case of:
keep_Zen_mode_UI_attached();
function keep_Zen_mode_UI_attached() {
  setInterval(attach_Zen_mode_UI, _utilityBeltConstantsTime.TIME.TENTH_OF_A_SECOND);
  _utilityBeltHelpersDebugDevprint.devprint("STATUS: Waiting for user to log in and open any chat to attach ZM UI.");
}
async function attach_Zen_mode_UI() {
  // 1.1. It is not already attached.
  // Explain: If the icon is already present - exit.
  if (_utilityBeltHelpersDomDOMShortcuts.DOM.get_el(_dataDictionary.Selectors.ZM_TOGGLE_BUTTON)) return;
  // 1.2. User navbar el is present (meaning WA has loaded and User clicked into any chat).
  // Explain: If WA user navbar not present - means either User is not yet logged in;
  // or not not a particular chat. In both cases - exit.
  const userNavbarEl = _utilityBeltHelpersDomDOMShortcuts.DOM.get_el(_dataDictionary.Selectors.WA_USER_NAVBAR);
  if (!userNavbarEl) return;
  // 2. Attaches Zen mode UI to the page.
  const WA_rightBtnGroupEl = userNavbarEl.children[userNavbarEl.children.length - 1].firstElementChild;
  if (!WA_rightBtnGroupEl) _processErrorsProcessError.process_error(Error(`rightBtnGroupEl not found`));
  // 2.1. Constructs the UI.
  const [toggleZenModeBtnEl, ZenModeBtnCtxMenuEl, releaseNotesAreaEl] = _constructZenModeUiConstructZenModeUi.construct_Zen_mode_UI();
  WA_rightBtnGroupEl.prepend(toggleZenModeBtnEl);
  const permanentZM_elsAreNotYetAttached = _utilityBeltHelpersDomDOMShortcuts.DOM.get_el(_dataDictionary.Selectors.ZM_RELEASE_NOTES_AREA) === null;
  if (permanentZM_elsAreNotYetAttached) {
    document.body.appendChild(ZenModeBtnCtxMenuEl);
    document.body.appendChild(releaseNotesAreaEl);
  }
  _utilityBeltHelpersDebugDevprint.devprint("STATUS: ZM main button attached.");
  // 2.2. Sets ZM UI in accordance with current ZM state (activated\deactivated).
  const currentZenModeStatus = await _utilityBeltHelpersExtnStorage.get_extn_storage_item_value(_dataDictionary.StateItemNames.ZEN_MODE_STATUS) ? _dataDictionary.ZenModeStatuses.ON : _dataDictionary.ZenModeStatuses.OFF;
  _userCanToggleZenModeCsToggleZenMode.toggle_Zen_mode_on_page(currentZenModeStatus);
}

},{"../../../../utility-belt/helpers/dom/DOM-shortcuts":"6BKmq","../process-errors/process-error":"5AXKD","../../../../utility-belt/helpers/extn/storage":"h8TiD","../../../../utility-belt/helpers/debug/devprint":"4rC6r","./construct-zen-mode-ui/construct-zen-mode-ui":"62zit","../../user-can/toggle-zen-mode/cs/toggle-zen-mode":"1rzXO","../../../data/dictionary":"7dDhZ","../../../../utility-belt/constants/time":"3gQ85"}],"62zit":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "construct_Zen_mode_UI", function () {
  return construct_Zen_mode_UI;
});
var _utilityBeltHelpersDebugDevprint = require("../../../../../utility-belt/helpers/debug/devprint");
var _constructZmToggleBtn = require("./construct-zm-toggle-btn");
var _userCanUseZenModeCtxMenuConstructZenModeCtxMenu = require("../../../user-can/use-zen-mode-ctx-menu/construct-zen-mode-ctx-menu");
var _userCanReadReleaseNotesConstructReleaseNotesItem = require("../../../user-can/read-release-notes/construct-release-notes-item");
function construct_Zen_mode_UI() /*toggleState: boolean*/
{
  const toggleZenModeBtnEl = _constructZmToggleBtn.construct_Zen_mode_toggle_btn();
  const ZenModeBtnCtxMenuEl = _userCanUseZenModeCtxMenuConstructZenModeCtxMenu.construct_zen_mode_ctx_menu();
  const releaseNotesAreaEl = _userCanReadReleaseNotesConstructReleaseNotesItem.construct_release_notes_area();
  _utilityBeltHelpersDebugDevprint.devprint("STATUS: UI constructed.");
  return [toggleZenModeBtnEl, ZenModeBtnCtxMenuEl, releaseNotesAreaEl];
}

},{"../../../../../utility-belt/helpers/debug/devprint":"4rC6r","./construct-zm-toggle-btn":"1hXUZ","../../../user-can/use-zen-mode-ctx-menu/construct-zen-mode-ctx-menu":"61ToF","../../../user-can/read-release-notes/construct-release-notes-item":"4EiL6","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"1hXUZ":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "construct_Zen_mode_toggle_btn", function () {
  return construct_Zen_mode_toggle_btn;
});
var _utilityBeltHelpersDomSetElAttributes = require("../../../../../utility-belt/helpers/dom/set-el-attributes");
var _userCanToggleZenModeCsToggleZenMode = require("../../../user-can/toggle-zen-mode/cs/toggle-zen-mode");
var _utilityBeltHelpersDomSetElText = require("../../../../../utility-belt/helpers/dom/set-el-text");
var _utilityBeltHelpersExtnStorage = require("../../../../../utility-belt/helpers/extn/storage");
var _utilityBeltHelpersDomSetElStyle = require("../../../../../utility-belt/helpers/dom/set-el-style");
var _userCanUseZenModeCtxMenuOpenCloseZenModeCtxMenu = require("../../../user-can/use-zen-mode-ctx-menu/open-close-zen-mode-ctx-menu");
var _RELEASENOTESYaml = require("../../../../../RELEASE-NOTES.yaml");
var _RELEASENOTESYamlDefault = _parcelHelpers.interopDefault(_RELEASENOTESYaml);
var _dataDictionary = require("../../../../data/dictionary");
var _utilityBeltHelpersDomDOMShortcuts = require("../../../../../utility-belt/helpers/dom/DOM-shortcuts");
function construct_Zen_mode_toggle_btn() /*toggleState: boolean*/
{
  const ZenModeBtnEl = document.createElement("div");
  _utilityBeltHelpersDomSetElAttributes.set_el_attributes(ZenModeBtnEl, {
    id: _dataDictionary.Selectors.ZM_TOGGLE_BUTTON.substring(1),
    // Explain: Keep for ref; actually handled in attach-zen-mode-iu.ts .
    // src: browser.runtime.getURL(
    // `assets/logo/${toggleState ? "logo.png" : "logo-off.png"}`,
    // ),
    title: "Toggle Zen mode"
  });
  // Explain: No solution for the moment.
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  ZenModeBtnEl.addEventListener("click", _userCanToggleZenModeCsToggleZenMode.toggle_Zen_mode);
  ZenModeBtnEl.addEventListener("contextmenu", _userCanUseZenModeCtxMenuOpenCloseZenModeCtxMenu.open_ZM_ctx_menu);
  document.body.addEventListener("click", evt => {
    if (evt.target.id !== _dataDictionary.Selectors.ZM_CTX_MENU) _userCanUseZenModeCtxMenuOpenCloseZenModeCtxMenu.close_ZM_ctx_menu();
  });
  const chevronEl = _utilityBeltHelpersDomDOMShortcuts.DOM.create_el({
    tag: "span",
    attributes: {
      id: _dataDictionary.Selectors.ZM_TOGGLE_BUTTON_CHEVRON.substring(1)
    },
    /*eslint-disable max-len*/
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 20" width="19" height="20">
        <path fill="currentColor" d="M3.8 6.7l5.7 5.7 5.7-5.7 1.6 1.6-7.3 7.2-7.3-7.2 1.6-1.6z"></path>
      </svg>
    `
  });
  chevronEl.addEventListener("click", evt => {
    evt.stopPropagation();
    _userCanUseZenModeCtxMenuOpenCloseZenModeCtxMenu.open_ZM_ctx_menu();
  });
  ZenModeBtnEl.appendChild(chevronEl);
  const versionNumberEl = document.createElement("div");
  _utilityBeltHelpersDomSetElAttributes.set_el_attributes(versionNumberEl, {
    id: _dataDictionary.Selectors.ZM_VERSION_NUMBER.substring(1)
  });
  // Explain: We are sure to have non-empty release notes.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  _utilityBeltHelpersDomSetElText.set_el_text(versionNumberEl, _RELEASENOTESYamlDefault.default[0].version);
  ZenModeBtnEl.appendChild(versionNumberEl);
  // Explain: Show or not versionNumberEl based on State.
  void _utilityBeltHelpersExtnStorage.get_extn_storage_item_value(_dataDictionary.StateItemNames.SHOW_VERSION_NUM).then(result => result ? _utilityBeltHelpersDomSetElStyle.set_el_style(versionNumberEl, {
    display: "initial"
  }) : void 0);
  return ZenModeBtnEl;
}

},{"../../../../../utility-belt/helpers/dom/set-el-attributes":"67U6e","../../../user-can/toggle-zen-mode/cs/toggle-zen-mode":"1rzXO","../../../../../utility-belt/helpers/dom/set-el-text":"2WkrW","../../../../../utility-belt/helpers/extn/storage":"h8TiD","../../../../../utility-belt/helpers/dom/set-el-style":"5CnJN","../../../user-can/use-zen-mode-ctx-menu/open-close-zen-mode-ctx-menu":"6PwW3","../../../../../RELEASE-NOTES.yaml":"6NWOI","../../../../data/dictionary":"7dDhZ","../../../../../utility-belt/helpers/dom/DOM-shortcuts":"6BKmq","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"2WkrW":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "set_el_text", function () {
  return set_el_text;
});
function set_el_text(el, text) {
  // Explain: By design. That's why this fn exists in the 1st place - not to have to ..
  // write this explain over and over again.
  // eslint-disable-next-line functional/immutable-data,no-param-reassign
  el.innerText = text;
  return el;
}

},{"@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"6PwW3":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "open_ZM_ctx_menu", function () {
  return open_ZM_ctx_menu;
});
_parcelHelpers.export(exports, "close_ZM_ctx_menu", function () {
  return close_ZM_ctx_menu;
});
var _utilityBeltHelpersDomSetElStyle = require("../../../../utility-belt/helpers/dom/set-el-style");
var _utilityBeltHelpersDomDOMShortcuts = require("../../../../utility-belt/helpers/dom/DOM-shortcuts");
var _dataDictionary = require("../../../data/dictionary");
function open_ZM_ctx_menu() {
  const ctxMenuEl = _utilityBeltHelpersDomDOMShortcuts.DOM.get_el(_dataDictionary.Selectors.ZM_CTX_MENU);
  _utilityBeltHelpersDomSetElStyle.set_el_style(ctxMenuEl, {
    display: "initial"
  });
}
function close_ZM_ctx_menu() {
  const ctxMenuEl = _utilityBeltHelpersDomDOMShortcuts.DOM.get_el(_dataDictionary.Selectors.ZM_CTX_MENU);
  _utilityBeltHelpersDomSetElStyle.set_el_style(ctxMenuEl, {
    display: "none"
  });
}

},{"../../../../utility-belt/helpers/dom/set-el-style":"5CnJN","../../../../utility-belt/helpers/dom/DOM-shortcuts":"6BKmq","../../../data/dictionary":"7dDhZ","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"6NWOI":[function(require,module,exports) {
module.exports = [
  {
    "version": 1.3,
    "changes": [
      "You can now activate Zen Mode with Alt+Z!",
      "Hide/Snooze conversations you don’t want to see.",
      "A new Zen Mode menu: unhiding contacts, release notes and user feedback."
    ]
  }
];
},{}],"61ToF":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "construct_zen_mode_ctx_menu", function () {
  return construct_zen_mode_ctx_menu;
});
var _utilityBeltHelpersDomSetElAttributes = require("../../../../utility-belt/helpers/dom/set-el-attributes");
var _sendFeedbackSendFeedback = require("../send-feedback/send-feedback");
var _unhideContactsUnhideContacts = require("../unhide-contacts/unhide-contacts");
var _readReleaseNotesReadReleaseNotesCs = require("../read-release-notes/read-release-notes-cs");
var _dataDictionary = require("../../../data/dictionary");
function construct_zen_mode_ctx_menu() {
  const ctxMenuEl = document.createElement("div");
  _utilityBeltHelpersDomSetElAttributes.set_el_attributes(ctxMenuEl, {
    id: _dataDictionary.Selectors.ZM_CTX_MENU.substring(1),
    class: [_dataDictionary.Selectors.WA_CONTACT_CTX_MENU.substring(1)]
  });
  const menuListEl = document.createElement("ul");
  _utilityBeltHelpersDomSetElAttributes.set_el_attributes(menuListEl, {
    class: [_dataDictionary.Selectors.WA_CONTACT_CTX_MENU_LIST.substring(1)]
  });
  ctxMenuEl.appendChild(menuListEl);
  [_unhideContactsUnhideContacts.construct_unhide_contacts_menu_item(), _readReleaseNotesReadReleaseNotesCs.construct_read_release_notes_menu_item(), _sendFeedbackSendFeedback.construct_send_feedback_menu_item()].forEach(menuItemEl => menuListEl.appendChild(menuItemEl));
  return ctxMenuEl;
}

},{"../../../../utility-belt/helpers/dom/set-el-attributes":"67U6e","../send-feedback/send-feedback":"DlZBJ","../unhide-contacts/unhide-contacts":"Nw5cT","../read-release-notes/read-release-notes-cs":"69bEq","../../../data/dictionary":"7dDhZ","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"DlZBJ":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "construct_send_feedback_menu_item", function () {
  return construct_send_feedback_menu_item;
});
var _useZenModeCtxMenuConstructZenModeCtxMenuItem = require("../use-zen-mode-ctx-menu/construct-zen-mode-ctx-menu-item");
var _webextensionPolyfillTs = require("webextension-polyfill-ts");
var _dataDictionary = require("../../../data/dictionary");
function construct_send_feedback_menu_item() {
  const text = _webextensionPolyfillTs.browser.i18n.getMessage("ZM_ctxMenuItem_contactUs");
  return _useZenModeCtxMenuConstructZenModeCtxMenuItem.construct_zen_mode_ctx_menu_item(text, action);
}
function action() {
  const subject = "Zen Mode extension feedback";
  // Explain: Decided to drop due to inconsistency in line breaks bw web and native email clients.
  // Keep for ref until 01.01.22.
  // const body = `
  // Things I don't enjoy about Zen Mode:
  // <br/><br/>
  // Things I like:
  // <br/><br/>
  // Anything else%3F:`;
  // 
  // window.open(`${URLS.FEEDBACK_EMAIL}?subject=${subject}&body=${body}`);
  window.open(`${_dataDictionary.URLS.FEEDBACK_EMAIL}?subject=${subject}`);
}

},{"../use-zen-mode-ctx-menu/construct-zen-mode-ctx-menu-item":"uW543","webextension-polyfill-ts":"4MjDP","../../../data/dictionary":"7dDhZ","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"uW543":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "construct_zen_mode_ctx_menu_item", function () {
  return construct_zen_mode_ctx_menu_item;
});
var _openCloseZenModeCtxMenu = require("./open-close-zen-mode-ctx-menu");
var _utilityBeltHelpersDomSetElAttributes = require("../../../../utility-belt/helpers/dom/set-el-attributes");
var _dataDictionary = require("../../../data/dictionary");
function construct_zen_mode_ctx_menu_item(text, action) {
  const menuItemEl = document.createElement("li");
  _utilityBeltHelpersDomSetElAttributes.set_el_attributes(menuItemEl, {
    // class: `${Selectors.WA_CONTACT_CTX_MENU_LIST_ITEM}
    class: `${_dataDictionary.Selectors.ZM_CTX_MENU_ITEM.substring(1)}`
  });
  menuItemEl.addEventListener("click", evt => {
    evt.stopImmediatePropagation();
    action();
    _openCloseZenModeCtxMenu.close_ZM_ctx_menu();
  });
  const menuItemContentEl = document.createElement("div");
  _utilityBeltHelpersDomSetElAttributes.set_el_attributes(menuItemContentEl, {
    class: _dataDictionary.Selectors.WA_CONTACT_CTX_MENU_ITEM_CONTENTS_DIV.replaceAll(".", "").replaceAll(",", "")
  });
  // Explain: By design.
  // eslint-disable-next-line functional/immutable-data
  menuItemContentEl.textContent = text;
  menuItemEl.appendChild(menuItemContentEl);
  return menuItemEl;
}

},{"./open-close-zen-mode-ctx-menu":"6PwW3","../../../../utility-belt/helpers/dom/set-el-attributes":"67U6e","../../../data/dictionary":"7dDhZ","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"Nw5cT":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "construct_unhide_contacts_menu_item", function () {
  return construct_unhide_contacts_menu_item;
});
var _useZenModeCtxMenuConstructZenModeCtxMenuItem = require("../use-zen-mode-ctx-menu/construct-zen-mode-ctx-menu-item");
var _webextensionPolyfillTs = require("webextension-polyfill-ts");
var _utilityBeltHelpersExtnStorage = require("../../../../utility-belt/helpers/extn/storage");
var _apiToggleContactParticlesVisibility = require("../../../api/toggle-contact-particles-visibility");
var _utilityBeltHelpersDomDOMShortcuts = require("../../../../utility-belt/helpers/dom/DOM-shortcuts");
var _apiGetContactElParticles = require("../../../api/get-contact-el-particles");
var _dataDictionary = require("../../../data/dictionary");
function construct_unhide_contacts_menu_item() {
  const text = _webextensionPolyfillTs.browser.i18n.getMessage("ZM_ctxMenuItem_unhideAll");
  return _useZenModeCtxMenuConstructZenModeCtxMenuItem.construct_zen_mode_ctx_menu_item(text, action);
}
function action() {
  // Explain: This would not work if storage got somehow corrupted.
  // Keep for ref until 01.01.22.
  // const hiddenContacts = (await get_extn_storage_item_value(
  // StateItemNames.HIDDEN_CONTACTS,
  // )) as HiddenContact[];
  // hiddenContacts.forEach((contact) => {
  // toggle_contact_particles_visibility(contact.name, false);
  // });
  const contactEls = _utilityBeltHelpersDomDOMShortcuts.DOM.get_els(_dataDictionary.Selectors.WA_CONTACTS);
  contactEls.forEach(contactEl => {
    _apiToggleContactParticlesVisibility.toggle_contact_particles_visibility({
      contactEl,
      shouldHide: false
    });
    const {nameEl} = _apiGetContactElParticles.get_contact_el_particles_AND_is_it_read(contactEl);
    nameEl.removeAttribute("style");
  });
  void _utilityBeltHelpersExtnStorage.set_extn_storage_item({
    [_dataDictionary.StateItemNames.HIDDEN_CONTACTS]: []
  });
}

},{"../use-zen-mode-ctx-menu/construct-zen-mode-ctx-menu-item":"uW543","webextension-polyfill-ts":"4MjDP","../../../../utility-belt/helpers/extn/storage":"h8TiD","../../../api/toggle-contact-particles-visibility":"6aiEk","../../../../utility-belt/helpers/dom/DOM-shortcuts":"6BKmq","../../../api/get-contact-el-particles":"1pH2S","../../../data/dictionary":"7dDhZ","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"6aiEk":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "toggle_contact_particles_visibility", function () {
  return toggle_contact_particles_visibility;
});
var _utilityBeltHelpersDomSetElStyle = require("../../utility-belt/helpers/dom/set-el-style");
var _getContactElByContactName = require("./get-contact-el-by-contact-name");
var _getContactElParticles = require("./get-contact-el-particles");
function toggle_contact_particles_visibility({contactName, shouldHide, contactEl}) {
  if (contactEl === undefined) {
    // Explain: Since contactEl is optional - we gotta account for that.
    // eslint-disable-next-line no-param-reassign
    contactEl = _getContactElByContactName.get_contact_el_by_contact_name(contactName);
    // Explain: It is real to not find the contact el for a given contact name;
    // because not all contacts are rendered - only 20 contact placeholder els.
    if (!contactEl) return;
  }
  const {nameEl, timeEl, contactElTextSectionBottomLineEl, contactIsRead} = _getContactElParticles.get_contact_el_particles_AND_is_it_read(contactEl);
  // Spec-start: The avatar, contact name or chat name remains. no chat text, no indication of messages. The contact should not turn bold upon message.
  // Explain: Use imperative style here.
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  shouldHide ? _utilityBeltHelpersDomSetElStyle.set_el_style(nameEl, {
    "font-weight": "400"
  }) : nameEl.removeAttribute("style");
  _utilityBeltHelpersDomSetElStyle.set_el_style(timeEl, {
    display: shouldHide ? "none" : "block"
  });
  _utilityBeltHelpersDomSetElStyle.set_el_style(contactElTextSectionBottomLineEl, {
    display: shouldHide ? "none" : "flex"
  });
}

},{"../../utility-belt/helpers/dom/set-el-style":"5CnJN","./get-contact-el-by-contact-name":"6Y5hG","./get-contact-el-particles":"1pH2S","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"6Y5hG":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "get_contact_el_by_contact_name", function () {
  return get_contact_el_by_contact_name;
});
var _featuresExtensionCanProcessErrorsProcessError = require("../features/extension-can/process-errors/process-error");
var _utilityBeltHelpersStringClean = require("../../utility-belt/helpers/string/clean");
var _utilityBeltHelpersDomDOMShortcuts = require("../../utility-belt/helpers/dom/DOM-shortcuts");
var _dataDictionary = require("../data/dictionary");
function get_contact_el_by_contact_name(contactName) {
  // Explain: Cant use find_nodes_containing fn because if contact name contains icons - ..
  // it f*s up the fn algo; because icons will be represented as <img>'s, not text.
  // Keeping for clarity.
  // const [contactNameTextEl] = find_nodes_containing({
  // Explain: Collect all els that have 'title' attr; find the one that corresponds to contact name;
  // that will be the contact that we need.
  const allContactNameEls = _utilityBeltHelpersDomDOMShortcuts.DOM.get_els(_dataDictionary.Selectors.WA_CONTACT_NAME);
  const contactNameTextEl = allContactNameEls.find(nameEl => _utilityBeltHelpersStringClean.clean_of_non_std_chars(nameEl.title) === contactName);
  // const get_els_with_title_attribute = () => DOM.get_els(`[title]`);
  // const find_text_el_corresponding_to_contact_name = () => DOM.get_els(`[title]`);
  // const contactNameTextEl = pipe(contactName, true).thru();
  // Explain: WA doesn't render all contacts at once. Only the ones that fit the height ..
  // of the contact list x2. So - it is real to not find the contact for a given contact name.
  if (!Boolean(contactNameTextEl)) return null;
  const contactSecondDivFromTop = contactNameTextEl.closest(_dataDictionary.Selectors.WA_CONTACT_SECOND_DIV);
  if (!contactSecondDivFromTop) _featuresExtensionCanProcessErrorsProcessError.throw_DOM_error(_dataDictionary.Selectors.WA_CONTACT_SECOND_DIV, "WA_CONTACT_SECOND_DIV");
  return contactSecondDivFromTop.parentNode;
}

},{"../features/extension-can/process-errors/process-error":"5AXKD","../../utility-belt/helpers/string/clean":"3eZfx","../../utility-belt/helpers/dom/DOM-shortcuts":"6BKmq","../data/dictionary":"7dDhZ","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"3eZfx":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "clean_of_non_std_chars", function () {
  return clean_of_non_std_chars;
});
function clean_of_non_std_chars(str) {
  // WARNING: Backslash is still being removed in this implementation.
  return str.replace(/[^\p{L}\p{N}\p{P}\p{Z}{^$=+±\\'|`\\~<>}]/gu, "").trim();
}

},{"@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"1pH2S":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "get_contact_el_particles_AND_is_it_read", function () {
  return get_contact_el_particles_AND_is_it_read;
});
var _featuresExtensionCanProcessErrorsProcessError = require("../features/extension-can/process-errors/process-error");
var _dataDictionary = require("../data/dictionary");
function get_contact_el_particles_AND_is_it_read(contactEl) {
  var _a, _b, _c, _d, _e, _f;
  const contactElTextSectionTopLineEl = (_c = (_b = (_a = contactEl.children[0]) === null || _a === void 0 ? void 0 : _a.children[0]) === null || _b === void 0 ? void 0 : _b.children[1]) === null || _c === void 0 ? void 0 : _c.children[0];
  const contactElTextSectionBottomLineEl = contactElTextSectionTopLineEl === null || contactElTextSectionTopLineEl === void 0 ? void 0 : contactElTextSectionTopLineEl.nextElementSibling;
  // Explain: Holds both Muted icon and Unread counter els.
  const contactElBottomRightCornerSpan = (_d = contactElTextSectionBottomLineEl === null || contactElTextSectionBottomLineEl === void 0 ? void 0 : contactElTextSectionBottomLineEl.children[1]) === null || _d === void 0 ? void 0 : _d.children[0];
  const contactIsMuted = contactEl.querySelector(_dataDictionary.Selectors.WA_CONTACT_MUTED_ICON);
  const [nameEl, timeEl, lastMsgEl, unreadCounterEl] = [contactElTextSectionTopLineEl === null || contactElTextSectionTopLineEl === void 0 ? void 0 : contactElTextSectionTopLineEl.children[0], contactElTextSectionTopLineEl === null || contactElTextSectionTopLineEl === void 0 ? void 0 : contactElTextSectionTopLineEl.children[1], contactElTextSectionBottomLineEl === null || contactElTextSectionBottomLineEl === void 0 ? void 0 : contactElTextSectionBottomLineEl.children[0], // Explain: 1st - if the conversation is muted; 2nd - standard conversation.
  contactIsMuted ? (_e = contactElBottomRightCornerSpan === null || contactElBottomRightCornerSpan === void 0 ? void 0 : contactElBottomRightCornerSpan.children[1]) === null || _e === void 0 ? void 0 : _e.children[0] : (_f = contactElBottomRightCornerSpan === null || contactElBottomRightCornerSpan === void 0 ? void 0 : contactElBottomRightCornerSpan.children[0]) === null || _f === void 0 ? void 0 : _f.children[0]];
  /*eslint-enable no-magic-numbers*/
  // Explain: unreadCounterEl is not included in the check because, well, all the msg might be read).
  if (!nameEl || !timeEl || !lastMsgEl) /*|| !unreadCounterEl*/
  _featuresExtensionCanProcessErrorsProcessError.process_error(Error(`
      Could not find either of [nameEl, timeEl, lastMsgEl, unreadCounterEl] when trying to access particles of a contact element.
      Probably, the contact el html structure has been changed in a recent WAW update.
      `));
  const contactIsRead = !unreadCounterEl;
  // prettier-ignore
  // @ts-expect-error; we have a guard against undefined in process_error fn.
  // eslint-disable-next-line max-len
  return {
    nameEl,
    timeEl,
    contactElTextSectionBottomLineEl,
    unreadCounterEl,
    contactIsRead
  };
}

},{"../features/extension-can/process-errors/process-error":"5AXKD","../data/dictionary":"7dDhZ","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"69bEq":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "construct_read_release_notes_menu_item", function () {
  return construct_read_release_notes_menu_item;
});
var _useZenModeCtxMenuConstructZenModeCtxMenuItem = require("../use-zen-mode-ctx-menu/construct-zen-mode-ctx-menu-item");
var _webextensionPolyfillTs = require("webextension-polyfill-ts");
var _utilityBeltHelpersDomSetElStyle = require("../../../../utility-belt/helpers/dom/set-el-style");
var _utilityBeltHelpersDomDOMShortcuts = require("../../../../utility-belt/helpers/dom/DOM-shortcuts");
var _removeVerNumBadge = require("./remove-ver-num-badge");
var _dataDictionary = require("../../../data/dictionary");
function construct_read_release_notes_menu_item() {
  const text = _webextensionPolyfillTs.browser.i18n.getMessage("ZM_ctxMenuItem_releaseNotes");
  return _useZenModeCtxMenuConstructZenModeCtxMenuItem.construct_zen_mode_ctx_menu_item(text, action);
}
function action() {
  const releaseNotesAreaEl = _utilityBeltHelpersDomDOMShortcuts.DOM.get_el(_dataDictionary.Selectors.ZM_RELEASE_NOTES_AREA);
  _utilityBeltHelpersDomSetElStyle.set_el_style(releaseNotesAreaEl, {
    display: "initial"
  });
  _removeVerNumBadge.remove_ver_num_badge();
}

},{"../use-zen-mode-ctx-menu/construct-zen-mode-ctx-menu-item":"uW543","webextension-polyfill-ts":"4MjDP","../../../../utility-belt/helpers/dom/set-el-style":"5CnJN","../../../../utility-belt/helpers/dom/DOM-shortcuts":"6BKmq","./remove-ver-num-badge":"4Cgar","../../../data/dictionary":"7dDhZ","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"4Cgar":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "remove_ver_num_badge", function () {
  return remove_ver_num_badge;
});
var _utilityBeltHelpersDomDOMShortcuts = require("../../../../utility-belt/helpers/dom/DOM-shortcuts");
var _utilityBeltHelpersExtnStorage = require("../../../../utility-belt/helpers/extn/storage");
var _dataDictionary = require("../../../data/dictionary");
function remove_ver_num_badge() {
  _utilityBeltHelpersDomDOMShortcuts.DOM.remove_el(_dataDictionary.Selectors.ZM_VERSION_NUMBER);
  void _utilityBeltHelpersExtnStorage.set_extn_storage_item({
    [_dataDictionary.StateItemNames.SHOW_VERSION_NUM]: false
  });
}

},{"../../../../utility-belt/helpers/dom/DOM-shortcuts":"6BKmq","../../../../utility-belt/helpers/extn/storage":"h8TiD","../../../data/dictionary":"7dDhZ","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"4EiL6":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "construct_release_notes_area", function () {
  return construct_release_notes_area;
});
var _utilityBeltHelpersDomDOMShortcuts = require("../../../../utility-belt/helpers/dom/DOM-shortcuts");
var _utilityBeltHelpersDomSetElStyle = require("../../../../utility-belt/helpers/dom/set-el-style");
var _dataDictionary = require("../../../data/dictionary");
var _RELEASENOTESYaml = require("../../../../RELEASE-NOTES.yaml");
var _RELEASENOTESYamlDefault = _parcelHelpers.interopDefault(_RELEASENOTESYaml);
function construct_release_notes_area() {
  const releaseNotesAreaEl = _utilityBeltHelpersDomDOMShortcuts.DOM.create_el({
    tag: "div",
    attributes: {
      id: _dataDictionary.Selectors.ZM_RELEASE_NOTES_AREA.substring(1),
      class: _dataDictionary.Selectors.WA_CONTACT_CTX_MENU.substring(1)
    }
  });
  const headerEl = _utilityBeltHelpersDomDOMShortcuts.DOM.create_el({
    tag: "h1",
    text: "Release notes"
  });
  releaseNotesAreaEl.appendChild(headerEl);
  // Explain: We'll keep support for multiple RNs in release-notes.yaml.
  // But in current ver we only use one RN.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const notesForLatestRelease = _RELEASENOTESYamlDefault.default[0];
  const versionEl = _utilityBeltHelpersDomDOMShortcuts.DOM.create_el({
    tag: "div",
    text: `Version ${notesForLatestRelease.version}`,
    attributes: {
      id: _dataDictionary.Selectors.ZM_RELEASE_NOTES_AREA_VERSION.substring(1)
    }
  });
  releaseNotesAreaEl.appendChild(versionEl);
  const releaseNotesListEl = _utilityBeltHelpersDomDOMShortcuts.DOM.create_el({
    tag: "ul"
  });
  releaseNotesAreaEl.appendChild(releaseNotesListEl);
  notesForLatestRelease.changes.forEach(descr => {
    const noteEl = _utilityBeltHelpersDomDOMShortcuts.DOM.create_el({
      tag: "li",
      text: descr
    });
    releaseNotesListEl.appendChild(noteEl);
  });
  const closeBtnEl = _utilityBeltHelpersDomDOMShortcuts.DOM.create_el({
    tag: "div",
    text: "x",
    attributes: {
      id: _dataDictionary.Selectors.ZM_RELEASE_NOTES_AREA_CLOSE_BTN.substring(1)
    }
  });
  closeBtnEl.addEventListener("click", () => _utilityBeltHelpersDomSetElStyle.set_el_style(releaseNotesAreaEl, {
    display: "none"
  }));
  releaseNotesAreaEl.appendChild(closeBtnEl);
  return releaseNotesAreaEl;
}

},{"../../../../utility-belt/helpers/dom/DOM-shortcuts":"6BKmq","../../../../utility-belt/helpers/dom/set-el-style":"5CnJN","../../../data/dictionary":"7dDhZ","../../../../RELEASE-NOTES.yaml":"6NWOI","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"3gQ85":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "TIME", function () {
  return TIME;
});
const TIME = {
  SECONDS_IN_ONE_MINUTE: 60,
  TENTH_OF_A_SECOND: 100,
  QUARTER_SECOND: 250,
  HALF_A_SECOND: 500,
  ONE_SECOND: 1000,
  TWO_SECONDS: 2000,
  THREE_SECONDS: 3000,
  FIVE_SECONDS: 5000,
  TEN_SECONDS: 10000,
  FIFTEEN_SECONDS: 15000,
  HALF_A_MINUTE: 30000,
  MS_IN_ONE_SECOND: 1000,
  TIMEOUT_MAX: 2147483647,
  ONE_MONTH_30: 30 * 24 * 60 * 60 * 1000
};

},{"@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"32Tll":[function(require,module,exports) {
var _utilityBeltHelpersDomDOMShortcuts = require("../../../utility-belt/helpers/dom/DOM-shortcuts");
var _utilityBeltHelpersDebugDevprint = require("../../../utility-belt/helpers/debug/devprint");
var _extensionCanDisplayZenModeUiConstructZenModeUiAttachHideContactItem = require("../extension-can/display-zen-mode-ui/construct-zen-mode-ui/attach-hide-contact-item");
var _utilityBeltHelpersExtnStorage = require("../../../utility-belt/helpers/extn/storage");
var _apiToggleContactParticlesVisibility = require("../../api/toggle-contact-particles-visibility");
var _apiToggleContactVisibilityOnContentMutation = require("../../api/toggle-contact-visibility-on-content-mutation");
var _dataDictionary = require("../../data/dictionary");
var _utilityBeltConstantsTime = require("../../../utility-belt/constants/time");
// 0. Attaches DOM observer and checks for tf conditions:
const observer = new MutationObserver(mutations => {
  mutations.forEach(async mutation => {
    var _a;
    // 1. Contact els content mutation (either on scroll or sorting due to new messages).
    const isContactElContentMutation = mutation.type === "attributes" && Boolean((_a = mutation.oldValue) === null || _a === void 0 ? void 0 : _a.match(/(?=.*z-index)(?=.*transform: translateY)/));
    if (isContactElContentMutation) {
      void _apiToggleContactVisibilityOnContentMutation.toggle_contact_visibility_on_content_mutation(mutation);
      return;
    }
    const notAnElementAdditionMutation = mutation.addedNodes.length === 0;
    if (notAnElementAdditionMutation) return;
    mutation.addedNodes.forEach(async node => {
      const isTextNodeNotElement = !node_is_Element(node);
      if (isTextNodeNotElement) return;
      // 2. If WA contact context menu is present - Attach 'Hide contact' item.
      if (_utilityBeltHelpersDomDOMShortcuts.DOM.get_el(_dataDictionary.Selectors.WA_CONTACT_CTX_MENU) === node) _extensionCanDisplayZenModeUiConstructZenModeUiAttachHideContactItem.attach_hide_contact_item(node);
      // 3. On page load - hides the contacts that were hidden by user previously.
      if (_utilityBeltHelpersDomDOMShortcuts.DOM.get_el(_dataDictionary.Selectors.WA_CONTACT_LIST, node)) {
        const hiddenContacts = await _utilityBeltHelpersExtnStorage.get_extn_storage_item_value(_dataDictionary.StateItemNames.HIDDEN_CONTACTS);
        // Explain: Wait for all rendering and animations to complete; otherwise - buggy.
        setTimeout(() => {
          hiddenContacts.forEach(contact => {
            _apiToggleContactParticlesVisibility.toggle_contact_particles_visibility({
              contactName: contact.name,
              shouldHide: true
            });
          });
        }, _utilityBeltConstantsTime.TIME.ONE_SECOND);
      }
    });
  });
});
observer.observe(document.body, {
  attributes: true,
  attributeFilter: ["style"],
  attributeOldValue: true,
  childList: true,
  subtree: true
});
_utilityBeltHelpersDebugDevprint.devprint("STATUS: DOM observers attached.");
function node_is_Element(node) {
  return node instanceof Element;
}

},{"../../../utility-belt/helpers/dom/DOM-shortcuts":"6BKmq","../../../utility-belt/helpers/debug/devprint":"4rC6r","../extension-can/display-zen-mode-ui/construct-zen-mode-ui/attach-hide-contact-item":"2CKsi","../../../utility-belt/helpers/extn/storage":"h8TiD","../../api/toggle-contact-particles-visibility":"6aiEk","../../api/toggle-contact-visibility-on-content-mutation":"4Vdmu","../../data/dictionary":"7dDhZ","../../../utility-belt/constants/time":"3gQ85"}],"2CKsi":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "attach_hide_contact_item", function () {
  return attach_hide_contact_item;
});
var _utilityBeltHelpersDomDOMShortcuts = require("../../../../../utility-belt/helpers/dom/DOM-shortcuts");
var _apiGetHoveredContactEl = require("../../../../api/get-hovered-contact-el");
var _processErrorsProcessError = require("../../process-errors/process-error");
var _constructHideContactItem = require("./construct-hide-contact-item");
var _userCanHideContactsGetHoveredContactName = require("../../../user-can/hide-contacts/get-hovered-contact-name");
var _utilityBeltHelpersDomSetElAttributes = require("../../../../../utility-belt/helpers/dom/set-el-attributes");
var _dataDictionary = require("../../../../data/dictionary");
function attach_hide_contact_item(node) {
  // prettier-ignore
  // Explain: It shouldn't be a ZM element using WA styling; eg ZM_CTX_MENU or RN area .
  if ([_dataDictionary.Selectors.ZM_RELEASE_NOTES_AREA.substring(1), _dataDictionary.Selectors.ZM_CTX_MENU.substring(1)].includes(node.id)) return;
  // Explain: If there is no hovered el in the DOM - it means the WA ctx menu has been..
  // invoked from chat area, not contact list area. In that case - break.
  const hoveredDivEl = _apiGetHoveredContactEl.get_hovered_contact_el();
  if (!hoveredDivEl) return;
  const waContactCtxMenuEl = _utilityBeltHelpersDomDOMShortcuts.DOM.get_el(_dataDictionary.Selectors.WA_CONTACT_CTX_MENU);
  if (!waContactCtxMenuEl) {
    _processErrorsProcessError.throw_DOM_error(_dataDictionary.Selectors.WA_CONTACT_CTX_MENU, "WA_CONTACT_CTX_MENU");
    return;
  }
  const waContactCtxMenuListEl = _utilityBeltHelpersDomDOMShortcuts.DOM.get_el("ul", waContactCtxMenuEl);
  if (!waContactCtxMenuListEl) {
    _processErrorsProcessError.throw_DOM_error(_dataDictionary.Selectors.WA_CONTACT_CTX_MENU, "WA_CONTACT_CTX_MENU");
    return;
  }
  // Explain: Attach 'Hide contact' item.
  const hideContactCtxMenuItemEl = _constructHideContactItem.construct_Hide_contact_ctx_menu_item();
  waContactCtxMenuListEl.appendChild(hideContactCtxMenuItemEl);
  // Explain: Write contact name into the 'Hide' menu item - for storing it later in case..
  // User decides to press Hide. Because contact ctx menu and contact el itself are not ..
  // connected in any way in dom.
  const hoveredContactName = _userCanHideContactsGetHoveredContactName.get_hovered_contact_name();
  _utilityBeltHelpersDomSetElAttributes.set_el_attributes(hideContactCtxMenuItemEl, {
    [_dataDictionary.ZenDomDataAttributes["contact-name"]]: hoveredContactName
  });
}

},{"../../../../../utility-belt/helpers/dom/DOM-shortcuts":"6BKmq","../../../../api/get-hovered-contact-el":"7smNz","../../process-errors/process-error":"5AXKD","./construct-hide-contact-item":"1yBXE","../../../user-can/hide-contacts/get-hovered-contact-name":"7apE6","../../../../../utility-belt/helpers/dom/set-el-attributes":"67U6e","../../../../data/dictionary":"7dDhZ","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"7smNz":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "get_hovered_contact_el", function () {
  return get_hovered_contact_el;
});
var _dataDictionary = require("../data/dictionary");
var _utilityBeltHelpersDomDOMShortcuts = require("../../utility-belt/helpers/dom/DOM-shortcuts");
function get_hovered_contact_el() {
  return _utilityBeltHelpersDomDOMShortcuts.DOM.get_el(_dataDictionary.Selectors.WA_CONTACT_ELEMENT_HOVERED_DIV);
}

},{"../data/dictionary":"7dDhZ","../../utility-belt/helpers/dom/DOM-shortcuts":"6BKmq","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"1yBXE":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "construct_Hide_contact_ctx_menu_item", function () {
  return construct_Hide_contact_ctx_menu_item;
});
var _utilityBeltHelpersDomSetElAttributes = require("../../../../../utility-belt/helpers/dom/set-el-attributes");
var _webextensionPolyfillTs = require("webextension-polyfill-ts");
var _userCanHideContactsHideContact = require("../../../user-can/hide-contacts/hide-contact");
var _dataDictionary = require("../../../../data/dictionary");
function construct_Hide_contact_ctx_menu_item() {
  const menuItemEl = document.createElement("li");
  _utilityBeltHelpersDomSetElAttributes.set_el_attributes(menuItemEl, {
    id: _dataDictionary.Selectors.ZM_HIDE_CONTACT_CTX_MENU_ITEM.substring(1)
  });
  menuItemEl.addEventListener("click", _userCanHideContactsHideContact.hide_contact);
  const contentsEl = document.createElement("div");
  _utilityBeltHelpersDomSetElAttributes.set_el_attributes(contentsEl, {
    class: _dataDictionary.Selectors.WA_CONTACT_CTX_MENU_ITEM_CONTENTS_DIV.replaceAll(".", "").replaceAll(",", "")
  });
  // Explain: DOM construction in-memory.
  // eslint-disable-next-line functional/immutable-data
  contentsEl.innerText = _webextensionPolyfillTs.browser.i18n.getMessage("WA_contactCtxMenuItem_hide");
  menuItemEl.appendChild(contentsEl);
  return menuItemEl;
}

},{"../../../../../utility-belt/helpers/dom/set-el-attributes":"67U6e","webextension-polyfill-ts":"4MjDP","../../../user-can/hide-contacts/hide-contact":"37wt6","../../../../data/dictionary":"7dDhZ","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"37wt6":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "hide_contact", function () {
  return hide_contact;
});
var _utilityBeltHelpersDomDOMShortcuts = require("../../../../utility-belt/helpers/dom/DOM-shortcuts");
var _apiHideWaContextMenu = require("../../../api/hide-wa-context-menu");
var _addHiddenContactToStorage = require("./add-hidden-contact-to-storage");
var _apiToggleContactParticlesVisibility = require("../../../api/toggle-contact-particles-visibility");
var _dataDictionary = require("../../../data/dictionary");
function hide_contact() {
  _apiHideWaContextMenu.hide_WA_context_menu();
  const contactName = _utilityBeltHelpersDomDOMShortcuts.DOM.get_el(_dataDictionary.Selectors.ZM_HIDE_CONTACT_CTX_MENU_ITEM).getAttribute(_dataDictionary.ZenDomDataAttributes["contact-name"]);
  _apiToggleContactParticlesVisibility.toggle_contact_particles_visibility({
    contactName: contactName,
    shouldHide: true
  });
  void _addHiddenContactToStorage.add_hidden_contact_to_storage({
    name: contactName
  });
}

},{"../../../../utility-belt/helpers/dom/DOM-shortcuts":"6BKmq","../../../api/hide-wa-context-menu":"2HXqN","./add-hidden-contact-to-storage":"1eA5p","../../../api/toggle-contact-particles-visibility":"6aiEk","../../../data/dictionary":"7dDhZ","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"2HXqN":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "hide_WA_context_menu", function () {
  return hide_WA_context_menu;
});
var _utilityBeltHelpersDomDOMShortcuts = require("../../utility-belt/helpers/dom/DOM-shortcuts");
var _utilityBeltHelpersDomSetElStyle = require("../../utility-belt/helpers/dom/set-el-style");
var _dataDictionary = require("../data/dictionary");
function hide_WA_context_menu() {
  const WA_ctxMenuEl = _utilityBeltHelpersDomDOMShortcuts.DOM.get_el(_dataDictionary.Selectors.WA_CONTACT_CTX_MENU);
  _utilityBeltHelpersDomSetElStyle.set_el_style(WA_ctxMenuEl, {
    display: "none"
  });
}

},{"../../utility-belt/helpers/dom/DOM-shortcuts":"6BKmq","../../utility-belt/helpers/dom/set-el-style":"5CnJN","../data/dictionary":"7dDhZ","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"1eA5p":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "add_hidden_contact_to_storage", function () {
  return add_hidden_contact_to_storage;
});
var _apiGetHiddenContactsFromStorage = require("../../../api/get-hidden-contacts-from-storage");
var _utilityBeltHelpersExtnStorage = require("../../../../utility-belt/helpers/extn/storage");
var _dataDictionary = require("../../../data/dictionary");
async function add_hidden_contact_to_storage(contact) {
  const hiddenContacts = await _apiGetHiddenContactsFromStorage.get_hidden_contacts_from_storage();
  const newState = [...hiddenContacts, contact];
  void _utilityBeltHelpersExtnStorage.set_extn_storage_item({
    [_dataDictionary.StateItemNames.HIDDEN_CONTACTS]: newState
  });
}

},{"../../../api/get-hidden-contacts-from-storage":"6Ec0h","../../../../utility-belt/helpers/extn/storage":"h8TiD","../../../data/dictionary":"7dDhZ","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"6Ec0h":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "get_hidden_contacts_from_storage", function () {
  return get_hidden_contacts_from_storage;
});
var _utilityBeltHelpersExtnStorage = require("../../utility-belt/helpers/extn/storage");
var _dataDictionary = require("../data/dictionary");
async function get_hidden_contacts_from_storage() {
  const result = await _utilityBeltHelpersExtnStorage.get_extn_storage_item_value(_dataDictionary.StateItemNames.HIDDEN_CONTACTS);
  return result;
}

},{"../../utility-belt/helpers/extn/storage":"h8TiD","../data/dictionary":"7dDhZ","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"7apE6":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "get_hovered_contact_name", function () {
  return get_hovered_contact_name;
});
var _utilityBeltHelpersDomDOMShortcuts = require("../../../../utility-belt/helpers/dom/DOM-shortcuts");
var _extensionCanProcessErrorsProcessError = require("../../extension-can/process-errors/process-error");
var _apiGetHoveredContactEl = require("../../../api/get-hovered-contact-el");
var _utilityBeltHelpersStringClean = require("../../../../utility-belt/helpers/string/clean");
var _dataDictionary = require("../../../data/dictionary");
function get_hovered_contact_name() {
  const hoveredDivEl = _apiGetHoveredContactEl.get_hovered_contact_el();
  if (!hoveredDivEl) _extensionCanProcessErrorsProcessError.throw_DOM_error(_dataDictionary.Selectors.WA_CONTACT_ELEMENT_HOVERED_DIV, "WA_CONTACT_ELEMENT_HOVERED_DIV");
  const contactNameEl = _utilityBeltHelpersDomDOMShortcuts.DOM.get_el(_dataDictionary.Selectors.WA_CONTACT_NAME, hoveredDivEl);
  if (!contactNameEl) _extensionCanProcessErrorsProcessError.throw_DOM_error(_dataDictionary.Selectors.WA_CONTACT_NAME, "WA_CONTACT_NAME");
  const rawText = contactNameEl.textContent;
  // Explain: If contact name contains emojis - we must get rid of them.
  return _utilityBeltHelpersStringClean.clean_of_non_std_chars(rawText);
}

},{"../../../../utility-belt/helpers/dom/DOM-shortcuts":"6BKmq","../../extension-can/process-errors/process-error":"5AXKD","../../../api/get-hovered-contact-el":"7smNz","../../../../utility-belt/helpers/string/clean":"3eZfx","../../../data/dictionary":"7dDhZ","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"4Vdmu":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "toggle_contact_visibility_on_content_mutation", function () {
  return toggle_contact_visibility_on_content_mutation;
});
var _utilityBeltHelpersDomDOMShortcuts = require("../../utility-belt/helpers/dom/DOM-shortcuts");
var _toggleContactParticlesVisibility = require("./toggle-contact-particles-visibility");
var _elIsAHiddenContact = require("./el-is-a-hidden-contact");
var _getContactElName = require("./get-contact-el-name");
var _dataDictionary = require("../data/dictionary");
async function toggle_contact_visibility_on_content_mutation(mutation) {
  var _a;
  // 1. Checks if the mutation was in a contact el.
  const mutatedElIsNotInContactList = !((_a = _utilityBeltHelpersDomDOMShortcuts.DOM.get_el(_dataDictionary.Selectors.WA_CONTACT_LIST)) === null || _a === void 0 ? void 0 : _a.contains(mutation.target));
  if (mutatedElIsNotInContactList) return;
  // 2. Sets it's visibility css according to whether it is hidden by User or not.
  const mutatedElContactName = _getContactElName.get_contact_el_name(mutation.target);
  const mutatedElRepresentsHiddenContact = await _elIsAHiddenContact.el_is_a_hidden_contact(mutation.target);
  const shouldHide = mutatedElRepresentsHiddenContact;
  _toggleContactParticlesVisibility.toggle_contact_particles_visibility({
    contactName: mutatedElContactName,
    shouldHide
  });
}

},{"../../utility-belt/helpers/dom/DOM-shortcuts":"6BKmq","./toggle-contact-particles-visibility":"6aiEk","./el-is-a-hidden-contact":"5ksn6","./get-contact-el-name":"4okLv","../data/dictionary":"7dDhZ","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"5ksn6":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "el_is_a_hidden_contact", function () {
  return el_is_a_hidden_contact;
});
var _utilityBeltHelpersExtnStorage = require("../../utility-belt/helpers/extn/storage");
var _getContactElName = require("./get-contact-el-name");
var _dataDictionary = require("../data/dictionary");
async function el_is_a_hidden_contact(el) {
  const contactName = _getContactElName.get_contact_el_name(el);
  const hiddenContacts = await _utilityBeltHelpersExtnStorage.get_extn_storage_item_value(_dataDictionary.StateItemNames.HIDDEN_CONTACTS);
  return hiddenContacts.some(hiddenContact => hiddenContact.name === contactName);
}

},{"../../utility-belt/helpers/extn/storage":"h8TiD","./get-contact-el-name":"4okLv","../data/dictionary":"7dDhZ","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"4okLv":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "get_contact_el_name", function () {
  return get_contact_el_name;
});
var _getContactElParticles = require("./get-contact-el-particles");
function get_contact_el_name(el) {
  return _getContactElParticles.get_contact_el_particles_AND_is_it_read(el).nameEl.textContent.trim();
}

},{"./get-contact-el-particles":"1pH2S","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}]},["1EjNG"], "1EjNG", "parcelRequirea80e")

