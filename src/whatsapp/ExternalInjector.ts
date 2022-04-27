import browser from "webextension-polyfill";
import {set_el_attributes} from "../../utility-belt/helpers/dom/set-el-attributes";

function createScript(localScript: string): HTMLElement {
  const scriptEl = document.createElement('script');
  set_el_attributes(scriptEl, {
    src: browser.runtime.getURL(localScript)
  });
  return scriptEl;
}

export function injectWAPageProvider(): void {
  const root = (document.head || document.documentElement);
  root.appendChild(createScript('whatsapp/ExternalConnector.js'));
}

export function injectSocketWrapper(): void {
  const root = (document.head || document.documentElement);
  root.appendChild(createScript('whatsapp/WebSocketWrapper.js'));
}
