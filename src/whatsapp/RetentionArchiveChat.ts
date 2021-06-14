import {
  applyRetentionWWEffect, EffectChatCleaner,
  EffectChatSetter,
  EffectChatValidator,
  clearRetentionWWEffect
} from "./RetentionEffectChat";
import {archiveChatLocally, getChat, muteChatLocally, unarchiveChatLocally, unmuteChatLocally} from "./WWAController";

export type RetentionType = 'mute' | 'archive';

export function retentionArchiveChatLocally(chatId: string) {
  // Set state
  const initialChat = getChat(chatId)
  const chatArchivedByUser = initialChat.archive;
  const validator: EffectChatValidator = (chat) => {
    return chat.archive !== true;
  }
  const setter: EffectChatSetter = (chat) => {
    archiveChatLocally(chat);
  }
  const cleaner: EffectChatCleaner = (chat) => {
    if (chatArchivedByUser) return;
    unarchiveChatLocally(chat);
  }
  applyRetentionWWEffect(initialChat.id.toString(), 'archive', validator, setter, cleaner);
}

export function stopRetentionArchiveChatLocally(chatId: string) {
  clearRetentionWWEffect(chatId, 'archive');
}

export function retentionMuteChatLocally(chatId: string) {
  // Set state
  const initialChat = getChat(chatId);
  const chatMutedByUser = initialChat.mute.isMuted;
  const validator: EffectChatValidator = (chat) => {
    return chat.mute.isMuted !== true;
  }
  const setter: EffectChatSetter = (chat) => {
    muteChatLocally(chat);
  }
  const cleaner: EffectChatCleaner = (chat) => {
    if (chatMutedByUser) return;
    unmuteChatLocally(chat);
  }
  applyRetentionWWEffect(initialChat.id.toString(), 'mute', validator, setter, cleaner);
}

export function stopRetentionMuteChatLocally(chatId: string) {
  clearRetentionWWEffect(chatId, 'mute');
}
