import "../../features/state-machine/state-machine-cs";
import "../../features/extension-can/display-zen-mode-ui/attach-zen-mode-ui";
import "../../features/state-machine/attach-DOM-observers";
import "../../whatsapp/dom/ChatListObserver";
import "../../whatsapp/InchatPinsStatus";

// Explain: https://github.com/parcel-bundler/parcel/issues/5865.
// import "../../features/extension-can/display-zen-mode-ui/zen-mode-ui.css";

let zenModeOn = null;
let iconUpdaterInterval = null;


window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
  const payload = {
    errorMsg,
    url,
    lineNumber,
    column,
    errorObj,
  };
  const extBridgePort = chrome.runtime.connect('%%EXTENSION_GLOBAL_ID%%', { name: '0YHQvtGB0Lg=' });
  extBridgePort.postMessage({ action: "LOG", payload: { type: "ERROR", message: "Content script error", payload } });

  return true;
};


return;

// function updateExtensionIcon() {
//   const icon = document.querySelector(".zen-mode-icon");
//   if (icon) {
//     icon.src = chrome.runtime.getURL(
//       `images/icons/${zenModeOn ? "logo-off.png" : "logo.png"}`,
//     );
//   }
// }

function runEmbedded() {
  const regularIconURL =
    "https://web.whatsapp.com/img/favicon_c5088e888c97ad440a61d247596f88e5.png";
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
      writable: true,
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
