import { rejects } from "assert";
import { resolve } from "path";
import { BridgePortType, BridgeRequest, BridgeResponse, WWAProviderCall, WWAProviderRequest } from "../../types";
import { buildBridgeRequest, generateBasicWWAResponse } from "../../Utils";

// import browser from "webextension-polyfill";
// see https://github.com/mozilla/webextension-polyfill/issues/316
// @ts-ignore
const browser = chrome;

interface ExternalBridge {
    _connection: any // Port
    connect(): void
    onDisconnect(): void
}

// class ExtensionContextBridge implements ExternalBridge {}
// class EventsContextBridge implements ExternalBridge {}
export class PageContextBridge implements ExternalBridge {
    _connection: any
    _requestHandlers = new Map<string, Function>()
    _responsePendings = new Map<string, Function>()
    
    constructor() {
        this.connect()
        this._listeners()
    }

    connect(): void {
        this._connection = browser.runtime.connect('%%EXTENSION_GLOBAL_ID%%', {
            name: BridgePortType.PAGE_CONTEXT_CONNECTOR })
    }
    onDisconnect(): void {
        throw new Error("Method not implemented.")
    }

    addHandler(call: string, handler: Function) {
        this._requestHandlers[call] = handler
    }

    sendRequest(call: string, args: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            const request = buildBridgeRequest(call, args);
            this._responsePendings[request.id] = resolve;
            pageBridgePort.postMessage(request);
        });
    }

    _listeners() {
        this._connection.onMessage.addListener((request: BridgeRequest) => {
            this._handleRequest(request)
        });
    }

    _handleResponse(response: BridgeResponse) {
        const requestId = response.id;
        if (requestId) {
            const callback = this._responsePendings[requestId];
            if (callback) {
                if (response.result) {
                    callback(response.result);
                } else {
                    callback();
                }
            }
            delete this._responsePendings[response.id]
        }
    }
    async _handleRequest(request: BridgeRequest) {
        let result;
        let error;
        try {
          if (this._requestHandlers.has(request.call)) {
            const callerFunc = this._requestHandlers.get(request.call);
            if (callerFunc) {
                if (request.args) {
                    result = await callerFunc(...request.args);
                  } else {
                    result = await callerFunc();
                  }
            } else {
                throw new Error(`Handler for '${request.call}' not defined`);    
            }
          } else {
            throw new Error(`Type of caller '${request.call}' not defined`);
          }
        } catch (e) {
          console.error(e, "Request ", request);
          error = e;
        }
        this._connection.postMessage(generateBasicWWAResponse(request.id, result, error, request));
      }
    }