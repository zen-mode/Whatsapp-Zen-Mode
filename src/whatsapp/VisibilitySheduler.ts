import browser from "webextension-polyfill";
import {
    StateItemNames
} from "../data/dictionary";
import { Chat } from "./model/Chat";
import { addHiddenChats, getVisibiltyShedule, removeHiddenChats } from "./Storage";

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


export type VisibilityShedule = [Chat, WeekShedule][];

export enum VisibilitySheduleVariant {
    Everyday="Everyday",
    Weekdays="Weekdays",
    Custom="Custom", 
}


export class VisibilitySheduler {
    private static STORAGE_TAG = StateItemNames.SCHEDULED_HIDDEN;
    private static DAEMON_NAME = 'alarm_HiddenChatDaemon';

    constructor() {
        this.hiddenChats = [];
        this.runDaemon();
    }
    
    private hiddenChats: Chat[];
    private сhatsVisibilityShedule: VisibilityShedule = []
    
    private runDaemon() {
        getVisibiltyShedule().then((storage) => {
            this.сhatsVisibilityShedule = storage[VisibilitySheduler.STORAGE_TAG] || [];
        })
        this.updateChatsVisibility();
        this.setMessageListeners();
        this.setAlarms();
    }

    private hideChat(chat: Chat) {
        this.hiddenChats.push(chat);
        addHiddenChats(chat);
    }

    private showChat(chat: Chat) {
        this.hiddenChats = this.hiddenChats.filter(({id}) => chat.id != id);
        removeHiddenChats(chat);
    }

    private setAlarms() {
        browser.alarms.clear(VisibilitySheduler.DAEMON_NAME);
        browser.alarms.create(VisibilitySheduler.DAEMON_NAME, {
            delayInMinutes: 1,
            periodInMinutes: 1
        });
        browser.alarms.onAlarm.addListener(({
            name
        }) => {
            if (name === VisibilitySheduler.DAEMON_NAME) {
                this.updateChatsVisibility();
            }
        });

    }

    private getChatsForHide() {
        const dateTime = new Date();
        const day = dateTime.getDay();
        const time = dateTime.getHours() * 60 + dateTime.getMinutes();
        return this.сhatsVisibilityShedule.reduce((result: Chat[], curr) => {
            const [chat, chatShedule] = curr;
            const currentDayChatShedule = chatShedule[day];
            
            if (!currentDayChatShedule) {
                result.push(chat);
            }

            if (currentDayChatShedule) {
                const [start, end] = currentDayChatShedule;
                if (time <= start || time >= end) {
                    result.push(chat);
                }          
            }
            return result  
        }, []);
    }

    public setShedule(chat: Chat, newShedule: WeekShedule) {
            if (!this.сhatsVisibilityShedule.find(([{id}, _]) => id === chat.id)) {
                const newVisibilityShedule: VisibilityShedule = [...this.сhatsVisibilityShedule, [chat, newShedule]];
                this.updateShedule(newVisibilityShedule)
                return;
            }
            const newVisibilityShedule: VisibilityShedule = this.сhatsVisibilityShedule.map(([{id}, shedule]) =>
                chat.id === id ? [chat, newShedule] : [chat, shedule]);
            this.updateShedule(newVisibilityShedule)
    }

    private updateShedule(newVisibilityShedule: VisibilityShedule) {
        browser.storage.local.set({
            [VisibilitySheduler.STORAGE_TAG]: newVisibilityShedule
        }).then(() => {
            this.сhatsVisibilityShedule = newVisibilityShedule;
            this.updateChatsVisibility();
        });
    }

    private handleMessages = (message: any, sender: any, sendResponse: any) => {
        const { type, payload } = message;
        switch (type) {
            case 'setShedule': {
                const {chat, shedule} = payload;
                this.setShedule(chat, shedule)
                break;
            }
            case 'deleteShedule': {
                const {chat} = payload;
                chat.forEach((it: Chat) => this.deleteShedule(it))
                break;
            }
        }
    }

    private setMessageListeners() {
        browser.runtime.onMessage.addListener(this.handleMessages);
    }

    public deleteShedule(chat: Chat) {
        const newVisibilityShedule: VisibilityShedule = this.сhatsVisibilityShedule.filter(([{id}, _]) => chat.id !== id);
        this.updateShedule(newVisibilityShedule);
    }

    public updateChatsVisibility() {
        const chatsForHide = this.getChatsForHide();
        const chatsToShow = this.hiddenChats.filter((chatId) => !chatsForHide.includes(chatId));
        const newHiddenChats = chatsForHide.filter((chatId) => !this.hiddenChats.includes(chatId));
        newHiddenChats.forEach((chatId) => this.hideChat(chatId));
        chatsToShow.forEach((chatId) => this.showChat(chatId));
    }
}