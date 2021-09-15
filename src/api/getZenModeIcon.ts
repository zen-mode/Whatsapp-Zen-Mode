import {ZenModeStatuses} from "../data/dictionary";
import {get_Zen_mode_status} from "../features/user-can/toggle-zen-mode/cs/toggle-zen-mode";
import browser from "webextension-polyfill";

export async function getZenModeLogoUrlByState(zenModeStatus?: ZenModeStatuses): Promise<string> {
  if (!zenModeStatus) {
    zenModeStatus = await get_Zen_mode_status();
  }

  return browser.runtime.getURL(
    `assets/logo/${zenModeStatus === ZenModeStatuses.ON ? "logo-off.png" : "logo.png"}`,
  );
}

export async function constructZenModeLogoIcon(logoUrl?: string): Promise<HTMLElement> {
  if (!logoUrl) {
    logoUrl = await getZenModeLogoUrlByState();
  }
  const div = document.createElement('DIV');
  div.className = 'ZenModeLogo';
  div.style.backgroundImage = `url('${logoUrl}')`;

  return div;
}
