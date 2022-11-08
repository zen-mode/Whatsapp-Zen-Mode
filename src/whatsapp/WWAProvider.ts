// @ts-ignore
import {getWWVersion} from "./WWAController";

const moduleRaidV5 = require('@pedroslopez/moduleraid');

export const MUTE_FOREVER = -1;

export let WapModule: any = null;
export let CmdModule: any = null;
export let ConnModule: any = null;
export let SocketModule: any = null;

function provideModules(): void {
  const moduleRaid = moduleRaidV5();

  WapModule = moduleRaid.findModule((m: any) => m.default && m.default.Chat)[0]?.default;
  CmdModule = moduleRaid.findModule('Cmd')[0]?.Cmd;
  ConnModule = moduleRaid.findModule('Conn')[0]?.Conn;
  SocketModule = moduleRaid.findModule('Socket')[0]?.Socket;
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
