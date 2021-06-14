const chatIdToChat = new Map<string, any>();

export function retentionArchiveChatLocally(chat: any) {
  if (chat) {
    chatIdToChat.set(String(chat.id), chat);
    if (chat.archive != true)
      chat.archive = true;
  }
}

export function retentionUnarchiveChatLocally(chatId: string) {
  const storedChat = chatIdToChat.get(chatId)
  if (storedChat) {
    if (storedChat.archive != false)
      storedChat.archive = false;
    chatIdToChat.delete(chatId);
  }
}

setInterval(() => {
  chatIdToChat.forEach(function(chat) {
    if (chat.archive !== true)
      chat.archive = true
  })
}, 100)
