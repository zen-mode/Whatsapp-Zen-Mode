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
})({"3yNus":[function(require,module,exports) {
require("../../features/user-can/read-release-notes/read-release-notes-bgs");
require("../../features/extension-can/activate-extn-icon-on-specific-page/activate-extn-icon");
require("../../features/state-machine/state-machine-bgs");

},{"../../features/user-can/read-release-notes/read-release-notes-bgs":"1r5Ox","../../features/extension-can/activate-extn-icon-on-specific-page/activate-extn-icon":"7dfSR","../../features/state-machine/state-machine-bgs":"1y3pg"}],"1r5Ox":[function(require,module,exports) {
var _webextensionPolyfillTs = require("webextension-polyfill-ts");
var _utilityBeltHelpersExtnStorage = require("../../../../utility-belt/helpers/extn/storage");
var _dataDictionary = require("../../../data/dictionary");
_webextensionPolyfillTs.browser.runtime.onInstalled.addListener(details => {
  if (details.reason !== "update") return;
  void _utilityBeltHelpersExtnStorage.set_extn_storage_item({
    [_dataDictionary.StateItemNames.SHOW_VERSION_NUM]: true
  });
});

},{"webextension-polyfill-ts":"4MjDP","../../../../utility-belt/helpers/extn/storage":"h8TiD","../../../data/dictionary":"7dDhZ"}],"4MjDP":[function(require,module,exports) {
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

},{}],"h8TiD":[function(require,module,exports) {
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

},{"webextension-polyfill-ts":"4MjDP","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"5J4vU":[function(require,module,exports) {
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
},{}],"7dDhZ":[function(require,module,exports) {
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

},{"@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"7dfSR":[function(require,module,exports) {
var _webextensionPolyfillTs = require("webextension-polyfill-ts");
// 1. Makes extn icon active on https://web.whatsapp.com/; disabled otherwise.
_webextensionPolyfillTs.browser.runtime.onInstalled.addListener(function () {
  _webextensionPolyfillTs.browser.declarativeContent.onPageChanged.removeRules(undefined, function () {
    _webextensionPolyfillTs.browser.declarativeContent.onPageChanged.addRules([{
      conditions: [new _webextensionPolyfillTs.browser.declarativeContent.PageStateMatcher({
        pageUrl: {
          hostEquals: "web.whatsapp.com",
          schemes: ["https"]
        }
      })],
      actions: [new _webextensionPolyfillTs.browser.declarativeContent.ShowPageAction()]
    }]);
  });
});

},{"webextension-polyfill-ts":"4MjDP"}],"1y3pg":[function(require,module,exports) {
var _webextensionPolyfillTs = require("webextension-polyfill-ts");
var _utilityBeltHelpersDebugDevprint = require("../../../utility-belt/helpers/debug/devprint");
var _utilityBeltHelpersExtnGetActiveTab = require("../../../utility-belt/helpers/extn/get-active-tab");
var _defaultState = require("./default-state");
var _dataDictionary = require("../../data/dictionary");
_utilityBeltHelpersDebugDevprint.devprint("STATUS: State machine running.");
// 0. Sets default state for state items that are undefined.
_defaultState.set_default_state();
// 1.1. Kb shortcut.
_webextensionPolyfillTs.browser.commands.onCommand.addListener(command => {
  _utilityBeltHelpersDebugDevprint.devprint(`STATUS: ${command} command received from keyboard`);
  void check_message_AND_run_procedure(command);
});
// 1.2. Extn icon click.
_webextensionPolyfillTs.browser.pageAction.onClicked.addListener(() => {
  _utilityBeltHelpersDebugDevprint.devprint(`STATUS: page action click received`);
  void check_message_AND_run_procedure(_dataDictionary.Commands.TOGGLE_ZEN_MODE);
});
async function check_message_AND_run_procedure(commandOrMessage) {
  if (commandOrMessage !== _dataDictionary.Commands.TOGGLE_ZEN_MODE) return;
  const activeTabId = await _utilityBeltHelpersExtnGetActiveTab.get_active_tab_id("BGS");
  if (activeTabId === undefined) {
    // Explain: By design.
    // eslint-disable-next-line no-console
    console.error("Could not get activeTabId");
    return;
  }
  // 2. Sends the command to CS toggle Zen mode.
  void _webextensionPolyfillTs.browser.tabs.sendMessage(activeTabId, {
    action: _dataDictionary.Commands.TOGGLE_ZEN_MODE
  });
  _utilityBeltHelpersDebugDevprint.devprint(`STATUS: ${JSON.stringify({
    action: _dataDictionary.Commands.TOGGLE_ZEN_MODE
  })} msg sent to the page`);
}

},{"webextension-polyfill-ts":"4MjDP","../../../utility-belt/helpers/debug/devprint":"4rC6r","../../../utility-belt/helpers/extn/get-active-tab":"6mWzy","./default-state":"4JmhL","../../data/dictionary":"7dDhZ"}],"4rC6r":[function(require,module,exports) {
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

},{}],"6mWzy":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "get_active_tab_id", function () {
  return get_active_tab_id;
});
var _webextensionPolyfillTs = require("webextension-polyfill-ts");
async function get_active_tab_id(initiatorName) {
  const tabs = await _webextensionPolyfillTs.browser.tabs.query({
    // Explain: Return the tab from which extension was launched.
    active: true,
    currentWindow: true
  });
  const [activeTab] = tabs;
  if (!activeTab || activeTab.id === undefined) {
    // eslint-disable-next-line no-console
    console.error(`${initiatorName !== null && initiatorName !== void 0 ? initiatorName : "No initiatorName provided"}: could not get active tab id`);
    return;
  }
  return activeTab.id;
}

},{"webextension-polyfill-ts":"4MjDP","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}],"4JmhL":[function(require,module,exports) {
var _parcelHelpers = require("@parcel/transformer-js/lib/esmodule-helpers.js");
_parcelHelpers.defineInteropFlag(exports);
_parcelHelpers.export(exports, "set_default_state", function () {
  return set_default_state;
});
var _utilityBeltHelpersExtnStorage = require("../../../utility-belt/helpers/extn/storage");
var _dataDictionary = require("../../data/dictionary");
function set_default_state() {
  const defaultState = [{
    key: _dataDictionary.StateItemNames.HIDDEN_CONTACTS,
    defaultValue: []
  }, {
    key: _dataDictionary.StateItemNames.SHOW_VERSION_NUM,
    defaultValue: true
  }, {
    key: _dataDictionary.StateItemNames.ZEN_MODE_STATUS,
    defaultValue: false
  }];
  // https://github.com/typescript-eslint/typescript-eslint/issues/3116 .
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  defaultState.forEach(async descr => {
    const currentValue = await _utilityBeltHelpersExtnStorage.get_extn_storage_item_value(_dataDictionary.StateItemNames.HIDDEN_CONTACTS);
    if (currentValue === undefined) void _utilityBeltHelpersExtnStorage.set_extn_storage_item({
      [descr.key]: descr.defaultValue
    });
  });
}

},{"../../../utility-belt/helpers/extn/storage":"h8TiD","../../data/dictionary":"7dDhZ","@parcel/transformer-js/lib/esmodule-helpers.js":"5J4vU"}]},["3yNus"], "3yNus", "parcelRequirea80e")

