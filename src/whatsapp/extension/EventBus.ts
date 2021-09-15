import browser, {Runtime} from "webextension-polyfill";
import {BridgePortType, InternalBusEvent, InternalEvent} from "../types";
import Port = Runtime.Port;

// @ts-ignore
const events = require('events');

const port = browser.runtime.connect(browser.runtime.id, {
  name: BridgePortType.WWA_EVENTS_CONNECTOR
});

class EventsTransmitter {
  private port: Runtime.Port;
  private emitter: any;

  private funcs: any

  constructor(port: Port, emitter: any) {
    this.port = port;
    this.emitter = emitter;
    this.initialize();
  }

  private initialize() {
    this.port.onMessage.addListener((event: InternalBusEvent) => {
      switch (event.name) {
        default:
          if (event.data)
            this.emitter.emit(event.name, ...event.data);
          else
            this.emitter.emit(event.name);
          break;
      }
    });
  }

  on(event: InternalEvent, listener: (...args: any[]) => void) {
    this.emitter.on(event, listener);
  }
}

const WWEvents = new EventsTransmitter(port, new events.EventEmitter());

export {
  WWEvents
}
