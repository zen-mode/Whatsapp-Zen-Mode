// Explain: This api is relatively small; will keep all in here.
/* eslint-disable max-lines */

import browser from "webextension-polyfill";

import {GenericObject} from "../../types/generic-types";

/**
 * @description: Saves an object using extn Storage API.
 * @exampleInput: {foo: 'bar'}
 * @exampleOutput: undefined
 * @sideEffects: browser API
 * @hasTests: false
 */
export async function set_extn_storage_item(
  item: GenericObject,
  sync = false,
): Promise<void> {
  if (sync) await browser.storage.sync.set(item);
  else await browser.storage.local.set(item);
}

/**
 * Gets an object's value from extn Storage.
 * @param: itemKey The key to retrieve.
 * @param: sync?: From sync storage?
 * @exampleInput: 'foo'  | -no args-
 * @exampleOutput: 'bar' | {foo: 'bar', ...restOfTheData}
 * @sideEffects: browser API
 * @hasTests: false
 */

/**
 * Gets an object's value from extn Storage.
 * @param itemKey - The key to retrieve.
 * If not specified - returns the whole contents of extn storage.
 * @param sync - From sync storage? Local storage by default.
 * @returns The value of `itemKey` property; or whole contents of extn storage.
 *
 * @exampleInput  'foo' | -no args- .
 * @exampleOutput 'bar' | {foo: 'bar', ...restOfTheData} .
 *
 * @sideEffects browser API.
 * @hasTests No.
 */
export async function get_extn_storage_item_value(
  itemKey?: string,
  sync = false,
): Promise<GenericObject | unknown> {
  if (itemKey !== undefined) {
    const itemObject = sync
      ? await browser.storage.sync.get(itemKey)
      : await browser.storage.local.get(itemKey);

    return itemObject[itemKey] as unknown;
  } else {
    const data = sync
      ? await browser.storage.sync.get()
      : await browser.storage.local.get();

    return data as GenericObject;
  }
}

/**
 * @description: Removes an item from extn Storage.
 * @exampleInput: 'foo'
 * @exampleOutput: void
 * @sideEffects: browser API
 * @hasTests: false
 */
export async function remove_extn_storage_item(
  itemKey: string,
  sync = false,
): Promise<void> {
  if (sync) await browser.storage.sync.remove(itemKey);
  else await browser.storage.local.remove(itemKey);
}

/**
 * @description: Clears all of extn Storage.
 * @exampleInput: n\a
 * @exampleOutput: undefined
 * @sideEffects: browser API
 * @hasTests: false
 */
export async function clear_extn_storage(sync = false): Promise<void> {
  if (sync) await browser.storage.sync.clear();
  else await browser.storage.local.clear();
}
