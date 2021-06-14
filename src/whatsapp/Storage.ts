import {get_extn_storage_item_value, set_extn_storage_item} from "../../utility-belt/helpers/extn/storage";
import {StateItemNames} from "../data/dictionary";
import {Chat} from "./model/Chat";
import {browser} from "webextension-polyfill-ts";

export function subscribeForeverHiddenChatChanges(onChanged: (hiddenChats: Chat[], oldHiddenChats: Chat[]) => void) {
  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.hasOwnProperty(StateItemNames.HIDDEN_CONTACTS)) {
      const hiddenChatsChanges = changes[StateItemNames.HIDDEN_CONTACTS];
      onChanged(hiddenChatsChanges.newValue, hiddenChatsChanges.oldValue);
    }
  })
}

export async function getHiddenChats(): Promise<Chat[]> {
  const hiddenChats = await get_extn_storage_item_value(StateItemNames.HIDDEN_CONTACTS) ?? [];
  return hiddenChats as Chat[];
}

export async function getHiddenChatById(chatId: string): Promise<Chat | undefined> {
  const chats = await getHiddenChats();
  return chats.find(c => c.id === chatId);
}

async function setHiddenChats(chats: Chat[]): Promise<void> {
  await set_extn_storage_item({
    [StateItemNames.HIDDEN_CONTACTS]: chats
  });
}

export async function addHiddenChats(
  ...chats: Chat[]
): Promise<void> {
  const storageChats = await getHiddenChats();
  for (const chat of chats) {
    const chatId = chat.id;
    const chatIndex = storageChats.findIndex(c => c.id === chatId);
    if (chatIndex === -1) {
      storageChats.push(chat);
    } else {
      storageChats[chatIndex] = chat;
    }
  }
  setHiddenChats(storageChats);
}

export async function removeHiddenChats(
  ...chats: Chat[]
): Promise<void> {
  const storageChats = await getHiddenChats();
  for (const chat of chats) {
    storageChats.splice(storageChats.findIndex(c => c.id === chat.id), 1);
  }
  setHiddenChats(storageChats);
}

export function clearHiddenChats(): void {
  setHiddenChats([]);
}

export async function isHiddenChatById(
  chatId: string
): Promise<boolean> {
  const storageChats = await getHiddenChats();
  return storageChats.some(c => c.id === chatId)
}

export async function isHiddenChatByTitle(
  chatTitle: string
): Promise<boolean> {
  const storageChats = await getHiddenChats();
  return storageChats.some(c => c.title === chatTitle)
}

export async function isHiddenChat(
  chat: Chat
): Promise<boolean> {
  return isHiddenChatById(chat.id)
}
