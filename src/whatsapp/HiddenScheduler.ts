import browser from "webextension-polyfill";
import {
    StateItemNames
} from "../data/dictionary";

export enum SCHEDULE_MODE {
    ALL_DAYS,
    BY_DAY,
    CUSTOM_PERIOD
}

export class HiddenChatDaemon {
    private static STORAGE_TAG = StateItemNames.SCHEDULED_HIDDEN;
    private static DAEMON_NAME = 'alarm_HiddenChatDaemon';

    constructor() {
        this.runDaemon();
    }

    private runDaemon() {
        browser.alarms.clear(HiddenChatDaemon.DAEMON_NAME);
        browser.alarms.create(HiddenChatDaemon.DAEMON_NAME, {
            delayInMinutes: 0,
            periodInMinutes: 1
        });
        browser.alarms.onAlarm.addListener(({
            name
        }) => {
            if (name === HiddenChatDaemon.DAEMON_NAME) {
                this.onAlarm();
            }
        });
    }

    private getChatsForHide(pendingChats) {
        const e = Object.entries(pendingChats);
        if (e.length) {
            const result = [];
            const dateTime = new Date();
            const day = dateTime.getDay();
            for (let i = e.length - 1; i >= 0; i--) {
                const chatId = e[i][0];
                const {
                    days,
                    mode
                } = e[i][1];
                switch (mode) {
                    case SCHEDULE_MODE.ALL_DAYS:
                        result.push(chatId);
                        break;
                    case SCHEDULE_MODE.BY_DAY:
                        if (days[day - 1]) {
                            result.push(chatId);
                        }
                        break;
                    case SCHEDULE_MODE.CUSTOM_PERIOD:
                        const [start, end] = days[day - 1];
                        if (dateTime >= start && dateTime <= end) {
                            result.push(chatId);
                        }
                        break;
                }
            }
            return result;
        } else {
            return [];
        }
    }

    private onAlarm() {
        browser.storage.local.get(HiddenChatDaemon.STORAGE_TAG).then((storage) => {
            const data = storage[HiddenChatDaemon.STORAGE_TAG];
            const chats = data.chats;
            const chatsForHide = this.getChatsForHide(chats);

            if (!chatsForHide.length) {
                return;
            }

            const hiddenByScheduler = data.hidden;
            let hiddenChats = data.hidden;

            for (let i = chatsForHide.length - 1; i; i--) {
                const chatId = chatsForHide[i];
                if (!hiddenByScheduler.includes(chatId)) {
                    hiddenByScheduler.push(chatId);
                    console.log('HIDE CHAT', chatId);
                    // HIDE CHAT
                }

                const a = hiddenChats.indexOf(chatId);
                if (a) {
                    hiddenChats.splice(a, 1);
                }
            }

            if (hiddenChats.length) {
                for (let i = hiddenChats.length - 1; i; i--) {
                    const chatId = hiddenChats[i];
                    console.log('UNHIDE CHAT', chatId);
                    // UNHIDE CHAT
                }
            }
        });
    }

    setChat(chatId, mode: SCHEDULE_MODE, days: {
        monday: any,
        tuesday: any,
        wednesday: any,
        thursday: any,
        friday: any,
        saturday: any,
        sunday: any
    } | null) {
        let newSettings: Array < Boolean | Array < Number >> ;
        switch (mode) {
            case SCHEDULE_MODE.ALL_DAYS:
                newSettings = [];
                break;
            case SCHEDULE_MODE.BY_DAY:
                if (days) {
                    newSettings = [
                        days.monday === true,
                        days.tuesday === true,
                        days.wednesday === true,
                        days.thursday === true,
                        days.friday === true,
                        days.saturday === true,
                        days.sunday === true
                    ];
                    break;
                }
                case SCHEDULE_MODE.CUSTOM_PERIOD:
                    if (days) {
                        newSettings = [days.monday, days.tuesday, days.wednesday, days.thursday,
                            days.friday, days.saturday, days.sunday
                        ];
                        break;
                    }
                    default:
                        return false;
        }
        browser.storage.local.get(HiddenChatDaemon.STORAGE_TAG).then((storage) => {
            const data = storage[HiddenChatDaemon.STORAGE_TAG];
            data.chats[chatId] = {
                days: newSettings,
                mode: mode
            };
            browser.storage.local.set({
                [HiddenChatDaemon.STORAGE_TAG]: data
            });
        });
        return true;
    }

    clearChat(chatId: String) {
        browser.storage.local.get(HiddenChatDaemon.STORAGE_TAG).then((data) => {
            data = data[HiddenChatDaemon.STORAGE_TAG];
            delete data.chats[chatId];
            browser.storage.local.set({
                [HiddenChatDaemon.STORAGE_TAG]: data
            });
        });
    }

    forseUpdate() {
        this.onAlarm();
    }
}