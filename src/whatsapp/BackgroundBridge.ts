import {browser, Runtime} from "webextension-polyfill-ts";
import {BridgePortType} from "./types";
import Port = Runtime.Port;

type WWABridge = {
  extensionControllerPort?: Port;
  externalPagePort?: Port;
};

const tabIdToWWABridge = {};

function handleWAProviderPort(port: Port) {
  if (port.sender && port.sender.tab && port.sender.tab.id) {
    const senderTabId = port.sender.tab.id;
    const tabPorts: WWABridge = tabIdToWWABridge[senderTabId] ?? {};
    switch (port.name) {
      case BridgePortType.WWA_EXTENSION_CONNECTOR:
        tabPorts.extensionControllerPort = port;
        port.onMessage.addListener(message => {
          const tabPorts: WWABridge = tabIdToWWABridge[senderTabId];
          if (tabPorts && tabPorts.externalPagePort) {
            tabPorts.externalPagePort.postMessage(message);
          }
        });
        break;
      case BridgePortType.WWA_EXTERNAL_CONNECTOR:
        tabPorts.externalPagePort = port;
        port.onMessage.addListener(message => {
          const tabPorts: WWABridge = tabIdToWWABridge[senderTabId];
          if (tabPorts && tabPorts.extensionControllerPort) {
            tabPorts.extensionControllerPort.postMessage(message);
          }
        });
        break;
    }
    tabIdToWWABridge[senderTabId] = tabPorts;
  }
}

browser.runtime.onConnect.addListener(function(port) {
  handleWAProviderPort(port);
});

browser.runtime.onConnectExternal.addListener(function(externalPort) {
  handleWAProviderPort(externalPort);
});

browser.runtime.onMessageExternal.addListener(function(message, sender) {
});

browser.runtime.onMessage.addListener(function(message) {
})

function closeCurrentTab() {
  browser.tabs.query({active: true, currentWindow: true}).then((tabs: any) => {
    const curTabId = tabs[0].id;
    browser.tabs.remove(curTabId);
  });
}
