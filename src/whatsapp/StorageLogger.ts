import {
  get_extn_storage_item_value,
  set_extn_storage_item,
} from "../../utility-belt/helpers/extn/storage";
import { StateItemNames } from "../data/dictionary";
import { getDebugModeStatus } from "./ui/MenuItems/debugMode";

export enum LoggerEventType {
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

export type LogItem = {
  datetime: number;
  type: LoggerEventType;
  message: string;
  payload?: unknown;
};

export type Log = LogItem[];


const MAX_LOG_ENTRIES = 300;
const STORAGE_LOGGER_KEY = "LOG";

class Logger {
  public async log(type: LoggerEventType, message: string, payload?: unknown) {
    const logItem: LogItem = {
      datetime: Date.now(),
      type,
      message,
      payload: payload && JSON.stringify(payload),
    };

    const debugModeStatus = await get_extn_storage_item_value(StateItemNames.DEBUG_MODE_STATUS);
    
    if (debugModeStatus) {

      const currentLog: Log = await this.getLog();
      const truncatedLog = currentLog.slice(-MAX_LOG_ENTRIES - 1);
      const newLog = [...truncatedLog, logItem];

      await set_extn_storage_item({ [STORAGE_LOGGER_KEY]: newLog });
    }
  }

  public async getLog() {
    const currentLog: Log =
      ((await get_extn_storage_item_value(STORAGE_LOGGER_KEY)) as Log) || [];
    return currentLog;
  }

  public async clearLog() {
    return await set_extn_storage_item({ [STORAGE_LOGGER_KEY]: [] });
  }
}

const logger = new Logger();

export { logger };
