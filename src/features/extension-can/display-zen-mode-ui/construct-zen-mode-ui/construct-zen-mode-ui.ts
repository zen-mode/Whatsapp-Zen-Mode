import {devprint} from "../../../../../utility-belt/helpers/debug/devprint";
import {constructZMMenuButton} from "./construct-zm-toggle-btn";
import {construct_release_notes_area} from "../../../user-can/read-release-notes/construct-release-notes-item";
import { construct_hide_popup_area } from "../../../user-can/hide-chat-form-popup/construct-chat-popup";

export function construct_Zen_mode_UI(): [
  HTMLDivElement,
  HTMLDivElement,
  HTMLDivElement,
] {
  const ZMMenuButtonEl = constructZMMenuButton();
  const releaseNotesAreaEl = construct_release_notes_area();
  const hideChatAreaEl = construct_hide_popup_area();

  devprint("STATUS: UI constructed.");

  return [ZMMenuButtonEl, releaseNotesAreaEl, hideChatAreaEl];
}
