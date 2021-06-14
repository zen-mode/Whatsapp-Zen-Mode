import {getChat} from "./WWAController";
import {RetentionType} from "./RetentionArchiveChat";

const INTERVAL_MS = 100;

export type EffectChatValidator = (chat: any) => boolean; /* Works each time for interval */
export type EffectChatSetter = (chat: any) => void; /* Works if EffectChatValidator returns true */
export type EffectChatCleaner = (chat: any) => void; /* Works after retention stopping */
export interface EffectFunctions {
  validator: EffectChatValidator,
  setter: EffectChatSetter,
  cleaner: EffectChatCleaner
}

// State
const retentionsByChatId = new Map<string, Map<RetentionType, EffectFunctions>>();

// Helpers
function getChatRetentions(chatId: string): Map<RetentionType, EffectFunctions> {
  const retentions = retentionsByChatId.get(chatId)
  if (!retentions) {
    return new Map<RetentionType, EffectFunctions>()
  }
  return retentions;
}

function retentionIsAppliedToChat(chatId: string, retentionType: RetentionType): boolean {
  const validatorsByRetentionType = retentionsByChatId.get(chatId);
  if (!validatorsByRetentionType) {
    return false;
  }
  return validatorsByRetentionType.has(retentionType);
}

export function applyRetentionWWEffect(
  chatId: string,
  retentionType: RetentionType,
  validator: EffectChatValidator,
  setter: EffectChatSetter,
  cleaner: EffectChatCleaner
): void {
  if (retentionIsAppliedToChat(chatId, retentionType)) {
    return; // Retention already applied
  }
  // Set initially
  setter(getChat(chatId));
  // Update state
  const chatRetentions = getChatRetentions(chatId);
  chatRetentions.set(retentionType, { validator, setter, cleaner } as EffectFunctions);
  retentionsByChatId.set(chatId, chatRetentions);
}

export function clearRetentionWWEffect(
  chatId: string,
  retentionType: RetentionType
) {
  const chatRetentions = getChatRetentions(chatId);
  const effectFncs = chatRetentions.get(retentionType);
  if (!effectFncs) return;
  // Update state
  chatRetentions.delete(retentionType);
  retentionsByChatId.set(chatId, chatRetentions);
  // Set value used to chat before retention applying.
  const { cleaner } = effectFncs;
  cleaner(getChat(chatId));
}

setInterval(() => {
  Array.from(retentionsByChatId.entries()).forEach(([chatId, retentions]) => {
    const chat = getChat(chatId);
    retentions.forEach(({ validator, setter }) => validator(chat) && setter(chat));
  });
}, INTERVAL_MS);
