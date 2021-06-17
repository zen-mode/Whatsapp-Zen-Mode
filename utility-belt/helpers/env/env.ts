/* eslint-env node */
/* eslint-disable no-process-env */

import {GenericObject} from "../../types/generic-types";

export const env_is = {
  prod: (): boolean => process.env.NODE_ENV === "production",
  dev: (): boolean => !env_is.prod(),

  webApp: (): boolean => !env_is.server() && !env_is.extn(),
  server: (): boolean => process && process.versions && !!process.versions.node,

  extn: (): boolean => env_is.extnBS() || env_is.extnCS(),
  extnBS: (): boolean => Boolean(chrome && chrome.permissions !== undefined),
  extnCS: (): boolean =>
    Boolean(chrome && chrome.permissions === undefined && chrome.storage),
};

// eslint-disable-next-line functional/immutable-data
(globalThis as GenericObject).Env = env_is;
