// @ts-ignore
import {devprint} from "../../utility-belt/helpers/debug/devprint";
import {getWWVersion} from "./WWAController";

const moduleRaidV5 = require('@pedroslopez/moduleraid');

export const MUTE_FOREVER = -1;

export let WapModule: any = null;
export let ChatModule: any = null;
export let CmdModule: any = null;
export let ConnModule: any = null;

export function provideModules(): void {
  const moduleRaid = moduleRaidV5();
  WapModule = moduleRaid.findModule('queryLinkPreview')[0].default;
  ChatModule = moduleRaid.findModule('Chat')[2].default;
  CmdModule = moduleRaid.findModule('Cmd')[0].Cmd;
  ConnModule = moduleRaid.findModule('Conn')[0].Conn;
}

devprint('WhatsApp Web version:', getWWVersion())
