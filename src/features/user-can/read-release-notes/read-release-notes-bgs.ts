/* Background script */

// Description:
// 1. When a new version is pushed, the zen mode icon changes to include the version number.
// It is also shown when extn if 1st installed; see default-state.ts.

import browser from "webextension-polyfill";
import {set_extn_storage_item} from "../../../../utility-belt/helpers/extn/storage";

import {StateItemNames} from "../../../data/dictionary";

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason !== "update") return;

  void set_extn_storage_item({[StateItemNames.RELEASE_NOTES_VIEWED]: false});
});
