import browser from "webextension-polyfill";
import {
    StateItemNames
} from "../data/dictionary";

export enum DayOfTheWeek  {
    SUN = "0",
    MON = "1",
    TUE = "2",
    WED = "3",
    THU = "4",
    FRI = "5",
    SAT = "6",
}

export type TimePeriod = [number, number] | undefined;
export type WeekShedule = Record<DayOfTheWeek, TimePeriod>;


export type VisibilityShedule = [string, WeekShedule][];

export enum VisibilitySheduleVariant {
    Everyday="Everyday",
    Weekdays="Weekdays",
    Custom="Custom", 
}


export class HiddenChatDaemon {
    private static STORAGE_TAG = StateItemNames.SCHEDULED_HIDDEN;
    private static DAEMON_NAME = 'alarm_HiddenChatDaemon';

    constructor() {
        this.hiddenChats = [];
        this.runDaemon();
    }
    
    private hiddenChats: string[];
    private сhatsVisibilityShedule: VisibilityShedule = []
    
    private runDaemon() {
        browser.storage.local.get(HiddenChatDaemon.STORAGE_TAG).then((storage) => {
            this.сhatsVisibilityShedule = storage[HiddenChatDaemon.STORAGE_TAG] || [];
            console.log({сhatsVisibilityShedule: this.сhatsVisibilityShedule});
        })
        this.updateChatsVisibility();
        this.setAlarms();
    }

    private hideChat(chatId: string) {
        this.hiddenChats.push(chatId);
        console.log("hideChat", chatId, this.hiddenChats);
    }

    private showChat(chatId: string) {
        this.hiddenChats = this.hiddenChats.filter((id) => chatId != id);
        console.log("showChat", chatId, this.hiddenChats);
    }

    
    private setAlarms() {
        browser.alarms.clear(HiddenChatDaemon.DAEMON_NAME);
        browser.alarms.create(HiddenChatDaemon.DAEMON_NAME, {
            delayInMinutes: 1,
            periodInMinutes: 1
        });
        browser.alarms.onAlarm.addListener(({
            name
        }) => {
            if (name === HiddenChatDaemon.DAEMON_NAME) {
                this.updateChatsVisibility();
            }
        });

    }

    private getChatsForHide() {
        const dateTime = new Date();
        const day = dateTime.getDay();
        const time = dateTime.getHours() * 60 + dateTime.getMinutes();
        return this.сhatsVisibilityShedule.reduce((result: string[], curr) => {
            const [chatId, chatShedule] = curr;
            const currentDayChatShedule = chatShedule[day];
            if (currentDayChatShedule) {
                const [start, end] = currentDayChatShedule;
                if (time <= start || time >= end) {
                    result.push(chatId);
                }          
            }
            return result  
        }, []);
    }

    public setShedule(chatId: string, newShedule: WeekShedule) {
            if (!this.сhatsVisibilityShedule.find(([sheduleChatId, _]) => sheduleChatId === chatId)) {
                const newVisibilityShedule: VisibilityShedule = [...this.сhatsVisibilityShedule, [chatId, newShedule]];
                this.updateShedule(newVisibilityShedule)
                return;
            }
            const newVisibilityShedule: VisibilityShedule = this.сhatsVisibilityShedule.map(([sheduleChatId, shedule]) =>
                sheduleChatId === chatId ? [sheduleChatId, newShedule] : [sheduleChatId, shedule]);
            this.updateShedule(newVisibilityShedule)
    }

    private updateShedule(newVisibilityShedule: VisibilityShedule) {
        browser.storage.local.set({
            [HiddenChatDaemon.STORAGE_TAG]: newVisibilityShedule
        }).then(() => {
            this.сhatsVisibilityShedule = newVisibilityShedule;
            this.updateChatsVisibility();
        });
    }

    public deleteShedule(chatId: String) {
        const newVisibilityShedule: VisibilityShedule = this.сhatsVisibilityShedule.filter(([id, _]) => chatId !== id);
        this.updateShedule(newVisibilityShedule);
    }

    public updateChatsVisibility() {
        const chatsForHide = this.getChatsForHide();
        const chatsToShow = this.hiddenChats.filter((chatId) => !chatsForHide.includes(chatId));
        const newHiddenChats = chatsForHide.filter((chatId) => !this.hiddenChats.includes(chatId));
        console.log("updateChatsVisibility", {newHiddenChats, chatsToShow, hiddenChats: this.hiddenChats});
        newHiddenChats.forEach((chatId) => this.hideChat(chatId));
        chatsToShow.forEach((chatId) => this.showChat(chatId));
        console.log("hiddenChats", this.hiddenChats);
    }

}