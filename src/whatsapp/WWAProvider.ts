// @ts-ignore
import {getWWVersion} from "./WWAController";
import { devprint } from "../../utility-belt/helpers/debug/devprint";

const moduleRaidV5 = require('@pedroslopez/moduleraid');

export const MUTE_FOREVER = -1;

export let WapModule: any = null;
export let CmdModule: any = null;
export let ConnModule: any = null;
export let SocketModule: any = null;

function provideModules(): void {
  const moduleRaid = moduleRaidV5();
<<<<<<< HEAD
  const WapModule = moduleRaid.findModule('queryLinkPreview')[0].default;
  const ChatModule = moduleRaid.findModule('Chat')[2].default;
  const CmdModule = moduleRaid.findModule('Cmd')[0].Cmd;
  const ConnModule = moduleRaid.findModule('Conn')[0].Conn;
  const SocketModule = moduleRaid.findModule('Socket')[0].Socket;
=======
  WapModule = moduleRaid.findModule('queryLinkPreview')[0].default;
  ChatModule = moduleRaid.findModule('Chat')[2].default;
  CmdModule = moduleRaid.findModule('Cmd')[0].Cmd;
  ConnModule = moduleRaid.findModule('Conn')[0].Conn;
  SocketModule = moduleRaid.findModule('Socket')[0].Socket;
>>>>>>> 92677be6f57dde6a62beb907b76c68473929f10d
  
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

export function safeProvideModules() {
  try {
    provideModules()
  } catch (e) {
    console.error("ERROR", e)
  }

  if (!WapModule || !WapModule.Chat)
    console.error("Missed [Wap]", WapModule)
  if (!CmdModule && !CmdModule.openChatAt)
    console.error("Missed [Cmd]", CmdModule)
  if (!ConnModule || !ConnModule.wid)
    console.error("Missed [Conn]", ConnModule)
  if (!SocketModule || !SocketModule.state)
    console.error("Missed [Socket]", SocketModule)

  window["ConnModule"] = ConnModule
}

console.info('WhatsApp Web version:', getWWVersion())
