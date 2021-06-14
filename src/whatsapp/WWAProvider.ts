// @ts-ignore
const moduleRaidV5 = require('@pedroslopez/moduleraid');

export const MUTE_FOREVER = -1;

export let ChatModule: any = null;
export let CmdModule: any = null;

export function provideModules(): void {
  const moduleRaid = moduleRaidV5();
  ChatModule = moduleRaid.findModule('Chat')[0].default;
  CmdModule = moduleRaid.findModule('Cmd')[0].default;
}

