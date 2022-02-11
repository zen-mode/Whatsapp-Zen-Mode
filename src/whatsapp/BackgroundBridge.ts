import browser, {Runtime} from "webextension-polyfill";
import { get_extn_storage_item_value } from "../../utility-belt/helpers/extn/storage";
import { StateItemNames } from "../data/dictionary";
import { Chat } from "./model/Chat";
import {BridgePortType} from "./types";
import Port = Runtime.Port;

type WWABridge = {
  extensionControllerPort?: Port;
  externalPagePort?: Port;
  eventsPagePort?: Port;
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
      case BridgePortType.WWA_EVENTS_CONNECTOR:
        if (port.sender.id)
          tabPorts.eventsPagePort = port;
        port.onMessage.addListener(message => {
          const tabPorts: WWABridge = tabIdToWWABridge[senderTabId];
          if (tabPorts && tabPorts.eventsPagePort) {
            tabPorts.eventsPagePort.postMessage(message);
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
  const { type, payload } = message;
  if (type === 'setAlarm') {
    browser.alarms.create(payload.chat.id, {delayInMinutes: payload.delay});
  }
})

async function alarmsWorker(alarmInfo: any) {
  const hiddenContacts = (await get_extn_storage_item_value(
    StateItemNames.HIDDEN_CONTACTS,
  )) as Chat[];

  if (!hiddenContacts) {
    return
  }
  const currentChat = hiddenContacts.find(item => item.id === alarmInfo.name);
  hiddenContacts.splice(hiddenContacts.findIndex(item => item.id === alarmInfo.name), 1);
  browser.tabs.query({}).then((tabs: any) => {
    if (tabs && tabs.length) {
      tabs.forEach((tab: any) => {
        browser.tabs.sendMessage(tab.id, {type: 'unhideChat', payload: {
          chat: currentChat
        }})
      });
    }
  });
}

browser.alarms.onAlarm.addListener(function(alarmInfo) {
  if (alarmInfo.name !== 'alarm_HiddenChatDaemon') {
    alarmsWorker(alarmInfo)
  }
})

function closeCurrentTab() {
  browser.tabs.query({active: true, currentWindow: true}).then((tabs: any) => {
    const curTabId = tabs[0].id;
    browser.tabs.remove(curTabId);
  });
}
