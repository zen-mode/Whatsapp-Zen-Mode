import {StateItemNames} from "./dictionary";

export type ExtnStorage = {
  [StateItemNames.HIDDEN_CONTACTS]: Chat[];
  [StateItemNames.RELEASE_NOTES_VIEWED]: boolean;
  [StateItemNames.ZEN_MODE_STATUS]: boolean;
  [StateItemNames.SETTINGS_MENU]: Boolean;
};

export type ReleaseNotes = {
  release: {
    description: string;
    changes: string[];
    link: "<a taget=\"_blank\" href=\"https://github.com/zen-mode/Whatsapp-Zen-Mode/blob/main/ReleaseNotes.md\">See previous versions</a>"
  }
};
