// @ts-ignore
import {devprint} from "../../utility-belt/helpers/debug/devprint";
import {getWWVersion} from "./WWAController";

const moduleRaidV5 = require('@pedroslopez/moduleraid');

export const MUTE_FOREVER = -1;

export let WapModule: any = null;
export let ChatModule: any = null;
export let CmdModule: any = null;
export let ConnModule: any = null;
export let SocketModule: any = null;

export function provideModules(): void {
  const moduleRaid = moduleRaidV5();
  WapModule = moduleRaid.findModule('queryLinkPreview')[0].default;
  ChatModule = moduleRaid.findModule('Chat')[1].default;
  CmdModule = moduleRaid.findModule('Cmd')[0].Cmd;
  ConnModule = moduleRaid.findModule('Conn')[0].Conn;
  SocketModule = moduleRaid.findModule('Socket')[0].Socket;
  
  const m = 'module not found';
  if (!WapModule) {
    devprint('WapModule', m);
  }
  if (!ChatModule) {
    devprint('ChatModule', m);
  }
  if (!CmdModule) {
    devprint('CmdModule', m);
  }
  if (!ConnModule) {
    devprint('ConnModule', m);
  }
  if (!SocketModule) {
    devprint('SocketModule', m);
  }
}

devprint('WhatsApp Web version:', getWWVersion())
