import {devprint} from "../../../../../utility-belt/helpers/debug/devprint";
import {construct_Zen_mode_toggle_btn} from "./construct-zm-toggle-btn";
import {construct_zen_mode_ctx_menu} from "../../../user-can/use-zen-mode-ctx-menu/construct-zen-mode-ctx-menu";
import {construct_release_notes_area} from "../../../user-can/read-release-notes/construct-release-notes-item";

export function construct_Zen_mode_UI(/*toggleState: boolean*/): [
  HTMLDivElement,
  HTMLDivElement,
  HTMLDivElement,
] {
  const toggleZenModeBtnEl = construct_Zen_mode_toggle_btn();
  const ZenModeBtnCtxMenuEl = construct_zen_mode_ctx_menu();
  const releaseNotesAreaEl = construct_release_notes_area();

  devprint("STATUS: UI constructed.");

  return [toggleZenModeBtnEl, ZenModeBtnCtxMenuEl, releaseNotesAreaEl];
}
