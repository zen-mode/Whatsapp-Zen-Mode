/* eslint-env webextensions */

/**
 * @description: Returns extn id. Must be run in the context of CS or BS.
 * @exampleInput:  none
 * @exampleOutput: 'mienkpdiobnlflkpobhijaijbachggke'
 * @sideEffects: chrome API - will be always different for different extns
 * @hasTests: no
 */
export function get_extn_id(): string {
  return chrome.runtime.id;
}

/**
 * @description: Returns extn URL. Must be run in the context of CS or BS.
 * @exampleInput:  none
 * @exampleOutput: "chrome-extension://mienkpdiobnlflkpobhijaijbachggke/"
 * @sideEffects: chrome API - will be always different for different extns
 * @hasTests: no
 */
export function get_extn_URL(): string {
  return chrome.extension.getURL("");
}
