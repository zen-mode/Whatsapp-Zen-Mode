// https://medium.com/better-programming/chrome-extension-intercepting-and-reading-the-body-of-http-requests-dd9ebdf2348b

/**
 * @description: Modifies XMLHttpRequest.open and .send methods so that when ..
 * a request with a given url signature is sent - response body is intercepted.
 * Then response body is sent to an extension with a given id.
 * @exampleInput: 'graph.facebook.com', 'hbbgimmkemjchhofmlcndbfbjblmaiel', 'instagram-data'
 * @exampleOutput: void
 * @sideEffects: Mutation of native objects, network IO, extn messaging.
 * @hasTests: false
 */
export function listen_for_http_response_body(
  urlPartialsToSniff: string[],
  extnId: string,
  messageType: string,
): void {
  // Output: [`"graph.facebook.com"`, `"media_manager/media_manager_instagram_content"`].
  // Explain: Wrapping in additional quotes is nec to properly interpolate string items of arrayin <script>.
  const urlPartialsStrings = urlPartialsToSniff.map((partial) => `"${partial}"`);
  const xhrOverrideScript = document.createElement("script");

  // Explain: Need to set innerHTML.
  // eslint-disable-next-line functional/immutable-data,no-unsanitized/property
  xhrOverrideScript.innerHTML = `
  (function() {
    var XHR = XMLHttpRequest.prototype;
    var send = XHR.send;
    var open = XHR.open;
    XHR.open = function(method, url) {
        this.url = url; // the request url
        return open.apply(this, arguments);
    }
    XHR.send = function() {
        this.addEventListener('load', function() {
            if ([${urlPartialsStrings}].every(partial=>this.url.includes(partial))) {
                const message = {type: '${messageType}', payload: this.response};
                chrome.runtime.sendMessage('${extnId}', message);
            }
        });
        return send.apply(this, arguments);
    };
  })();
  //# sourceURL=listen_for_http_response_body.ts
  `;

  document.head.prepend(xhrOverrideScript);
}
