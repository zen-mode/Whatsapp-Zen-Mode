/* eslint-disable max-lines */
// Explain: We want to keep the API in one module.

import {
  clear_chrome_storage,
  get_chrome_storage_item_value,
  remove_chrome_storage_item,
  set_chrome_storage_item,
} from "../chrome/storage";

import {env_is} from "../env/env";

import {GenericObject} from "../../types/generic-types";

//todo-team: include handling errors
//todo-team: add remote apis
export function storage(
  options: {
    remote?: boolean;
    sync?: boolean;
  } = {
    remote: false,
    sync: false,
  },
): {
  set_item: (item: GenericObject) => Promise<true>;
  get_item: (name: string) => Promise<unknown>;
  remove_item: (name: string) => Promise<true>;
  get_all: () => Promise<unknown>;
  clear: () => Promise<true>;
} {
  return {
    async set_item(item: GenericObject): Promise<true> {
      if (env_is.extnBS() || env_is.extnCS())
        await set_chrome_storage_item(item, options.sync);
      else {
        const [[key, value]] = Object.entries(item);
        localStorage.setItem(key, JSON.stringify(value));
      }

      return true;
    },

    async get_item(name: string): Promise<unknown> {
      if (env_is.extnBS() || env_is.extnCS())
        return get_chrome_storage_item_value(name, options.sync);
      else {
        return JSON.parse(localStorage.getItem(name) as string) as unknown;
      }
    },

    async remove_item(name: string): Promise<true> {
      if (env_is.extnBS() || env_is.extnCS())
        await remove_chrome_storage_item(name, options.sync);
      else localStorage.removeItem(name);

      return true;
    },

    async get_all(): Promise<GenericObject> {
      if (env_is.extnBS() || env_is.extnCS())
        return get_chrome_storage_item_value(undefined, options.sync) as Promise<
          GenericObject
        >;
      else {
        return JSON.parse(JSON.stringify(localStorage)) as GenericObject;
      }
    },

    async clear(): Promise<true> {
      if (env_is.extnBS() || env_is.extnCS()) await clear_chrome_storage(options.sync);
      else localStorage.clear();

      return true;
    },
  };
}
