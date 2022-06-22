import {get_extn_storage_item_value, set_extn_storage_item} from "../../../utility-belt/helpers/extn/storage";

import {StateItemNames} from "../../data/dictionary";

export function set_default_state(): void {
  const defaultState = [
    {key: StateItemNames.HIDDEN_CONTACTS, defaultValue: []},
    {key: StateItemNames.RELEASE_NOTES_VIEWED, defaultValue: false},
    {key: StateItemNames.ZEN_MODE_STATUS, defaultValue: false},
    {key: StateItemNames.SMART_MUTE_STATUS, defaultValue: false},
    {key: StateItemNames.SETTINGS_MENU, defaultValue: false},
    {key: StateItemNames.SCHEDULED_HIDDEN, defaultValue: {chats: {}, hidden: []}},
    {key: StateItemNames.PINNED_CHATS_STATUS_ENABLED, defaultValue: true},
  ] as const;

  // https://github.com/typescript-eslint/typescript-eslint/issues/3116 .
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  defaultState.forEach(async (descr) => {
    const currentValue = await get_extn_storage_item_value(
      StateItemNames.HIDDEN_CONTACTS,
    );
    if (currentValue === undefined)
      void set_extn_storage_item({[descr.key]: descr.defaultValue});
  });
}
