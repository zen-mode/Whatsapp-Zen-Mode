import {get_extn_storage_item_value, set_extn_storage_item} from "../../utility-belt/helpers/extn/storage";
import {StateItemNames} from "../data/dictionary";
import {Chat} from "./model/Chat";
import browser, {Storage} from "webextension-polyfill";
import StorageChange = Storage.StorageChange;
import { VisibilityShedule } from "./VisibilitySheduler";
import {get_contact_el_by_chat_name} from "../api/get-contact-el-by-contact-name";

export function subscribeForeverHiddenChatChanges(onChanged: (hiddenChats: Chat[], oldHiddenChats: Chat[]) => void) {
  subToStorageChangesForever(StateItemNames.HIDDEN_CONTACTS, (changes) => {
    onChanged(changes.newValue, changes.oldValue);
  });
}

export function subscribeForeverZenMorningChatChanges(onChanged: (zenMorningChat: Chat) => void) {
  subToStorageChangesForever(StateItemNames.ZEN_MORNING_CHAT, (changes) => {
    onChanged(changes.newValue);
  });
}

export function subscribeForeverPinnedChatsStatusChanges(onChanged: (enabled: boolean) => void) {
  subToStorageChangesForever(StateItemNames.PINNED_CHATS_STATUS_ENABLED, (changes) => {
    onChanged(changes.newValue);
  });
}

function subToStorageChangesForever(key: String, onChanged: (changes: StorageChange) => void, initValue = true) {
  if (initValue) {
    browser.storage.local.get(key).then((value) => {
      const v = value[key];
      if (v != undefined) {
        onChanged({
          newValue: v,
          oldValue: v
        });
      }
    });
  }
  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.hasOwnProperty(key)) {
      onChanged(changes[key]);
    }
  })
}

export async function getHiddenChats(): Promise<Chat[]> {
  const hiddenChats = await get_extn_storage_item_value(StateItemNames.HIDDEN_CONTACTS) ?? [];
  return hiddenChats as Chat[];
}

export async function getVisibiltyShedule(): Promise<VisibilityShedule> {
  const visibiltyShedule = await get_extn_storage_item_value(StateItemNames.SCHEDULED_HIDDEN) ?? [];
  return visibiltyShedule as VisibilityShedule;
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

export async function addMiniPreviewChats(
  ...chats: Chat[]
): Promise<void> {
  const storageChats = await getMiniPreviewChats();
  for (const chat of chats) {
    const chatId = chat.id;
    const chatIndex = storageChats.findIndex(c => c.id === chatId);
    if (chatIndex === -1) {
      storageChats.push(chat);
    } else {
      storageChats[chatIndex] = chat;
    }
  }
  setMiniPreviewChats(storageChats);
}

export async function getPinnedChatsStatus(): Promise<boolean> {
  const pinnedChatsStatus = await get_extn_storage_item_value(StateItemNames.PINNED_CHATS_STATUS_ENABLED) ?? [];
  return pinnedChatsStatus as boolean;
}

export async function getMiniPreviewChats(): Promise<Chat[]> {
  const miniPreviewChats = await get_extn_storage_item_value(StateItemNames.MINI_PREVIEW_CONTACTS) ?? [];
  return miniPreviewChats as Chat[];
}

async function setMiniPreviewChats(chats: Chat[]): Promise<void> {
  await set_extn_storage_item({
    [StateItemNames.MINI_PREVIEW_CONTACTS]: chats
  });
}

export async function removeMiniPreviewChats(
  ...chats: Chat[]
): Promise<void> {
  const storageChats = await getMiniPreviewChats();
  for (const chat of chats) {
    storageChats.splice(storageChats.findIndex(c => c.id === chat.id), 1);
  }
  setMiniPreviewChats(storageChats);
}

export async function isMiniPreviewChat(
  chat: Chat
): Promise<boolean> {
  return isMiniPreviewChatById(chat.id)
}

export async function isMiniPreviewChatById(
  chatId: string
): Promise<boolean> {
  const storageChats = await getMiniPreviewChats();
  return storageChats.some(c => c.id === chatId)
}

export async function countMiniPreviewChats() {
  const storageChats = await getMiniPreviewChats();
  return storageChats.length;
}

export function clearMiniPreviewChats(): void {
  setMiniPreviewChats([]);
}