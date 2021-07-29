(function () {
var $79ba1ac996accdfb0162ac0d8cb02bcc$export$ce596a179b780573;
(function(BridgePortType) {
    BridgePortType["WWA_EXTENSION_CONNECTOR"] = "0LLQsNGC0YbQsNC/";
    BridgePortType["WWA_EXTERNAL_CONNECTOR"] = "0YHQvtGB0Lg=";
})($79ba1ac996accdfb0162ac0d8cb02bcc$export$ce596a179b780573 || ($79ba1ac996accdfb0162ac0d8cb02bcc$export$ce596a179b780573 = {
}));
var $79ba1ac996accdfb0162ac0d8cb02bcc$export$a3bfcfbc59c6c960;
(function(WWAProviderCall) {
    WWAProviderCall[WWAProviderCall["findChatByTitle"] = 0] = "findChatByTitle";
    WWAProviderCall[WWAProviderCall["updateChatModels"] = 1] = "updateChatModels";
    WWAProviderCall[WWAProviderCall["muteChatLocally"] = 2] = "muteChatLocally";
    WWAProviderCall[WWAProviderCall["unmuteChatsLocally"] = 3] = "unmuteChatsLocally";
    WWAProviderCall[WWAProviderCall["archiveChatLocally"] = 4] = "archiveChatLocally";
    WWAProviderCall[WWAProviderCall["unArchiveChatLocally"] = 5] = "unArchiveChatLocally";
    WWAProviderCall[WWAProviderCall["muteNonMutedChatsExceptChat"] = 6] = "muteNonMutedChatsExceptChat";
    WWAProviderCall[WWAProviderCall["setChatsSounds"] = 7] = "setChatsSounds";
    WWAProviderCall[WWAProviderCall["getChatsSoundsState"] = 8] = "getChatsSoundsState";
    WWAProviderCall[WWAProviderCall["getChatById"] = 9] = "getChatById";
    WWAProviderCall[WWAProviderCall["getOpenedChat"] = 10] = "getOpenedChat";
    WWAProviderCall[WWAProviderCall["openChat"] = 11] = "openChat";
    WWAProviderCall[WWAProviderCall["refreshWWChats"] = 12] = "refreshWWChats";
    WWAProviderCall[WWAProviderCall["markChatAsRead"] = 13] = "markChatAsRead";
})($79ba1ac996accdfb0162ac0d8cb02bcc$export$a3bfcfbc59c6c960 || ($79ba1ac996accdfb0162ac0d8cb02bcc$export$a3bfcfbc59c6c960 = {
})); //# sourceMappingURL=types.js.map


// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).
var $746842f83862dd3a80fb8e13adc02d33$var$getRandomValues;
var $746842f83862dd3a80fb8e13adc02d33$var$rnds8 = new Uint8Array(16);
function $746842f83862dd3a80fb8e13adc02d33$export$9099ad97b570f7c() {
    // lazy load so that environments that need to polyfill have a chance to do so
    if (!$746842f83862dd3a80fb8e13adc02d33$var$getRandomValues) {
        // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation. Also,
        // find the complete implementation of crypto (msCrypto) on IE11.
        $746842f83862dd3a80fb8e13adc02d33$var$getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto !== 'undefined' && typeof msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto);
        if (!$746842f83862dd3a80fb8e13adc02d33$var$getRandomValues) throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
    return $746842f83862dd3a80fb8e13adc02d33$var$getRandomValues($746842f83862dd3a80fb8e13adc02d33$var$rnds8);
}


var $ae700833c52cbd3790c778eadb14c07e$export$9099ad97b570f7c = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;


function $e4445ce001b6549dd861c1044bbb3636$var$validate(uuid) {
    return typeof uuid === 'string' && $ae700833c52cbd3790c778eadb14c07e$export$9099ad97b570f7c.test(uuid);
}
var $e4445ce001b6549dd861c1044bbb3636$export$9099ad97b570f7c = $e4445ce001b6549dd861c1044bbb3636$var$validate;


/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */ var $46d941dbafbd459fd8c0f3ef1201321a$var$byteToHex = [];
for(var $46d941dbafbd459fd8c0f3ef1201321a$var$i = 0; $46d941dbafbd459fd8c0f3ef1201321a$var$i < 256; ++$46d941dbafbd459fd8c0f3ef1201321a$var$i)$46d941dbafbd459fd8c0f3ef1201321a$var$byteToHex.push(($46d941dbafbd459fd8c0f3ef1201321a$var$i + 256).toString(16).substr(1));
function $46d941dbafbd459fd8c0f3ef1201321a$var$stringify(arr) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    // Note: Be careful editing this code!  It's been tuned for performance
    // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
    var uuid = ($46d941dbafbd459fd8c0f3ef1201321a$var$byteToHex[arr[offset + 0]] + $46d941dbafbd459fd8c0f3ef1201321a$var$byteToHex[arr[offset + 1]] + $46d941dbafbd459fd8c0f3ef1201321a$var$byteToHex[arr[offset + 2]] + $46d941dbafbd459fd8c0f3ef1201321a$var$byteToHex[arr[offset + 3]] + '-' + $46d941dbafbd459fd8c0f3ef1201321a$var$byteToHex[arr[offset + 4]] + $46d941dbafbd459fd8c0f3ef1201321a$var$byteToHex[arr[offset + 5]] + '-' + $46d941dbafbd459fd8c0f3ef1201321a$var$byteToHex[arr[offset + 6]] + $46d941dbafbd459fd8c0f3ef1201321a$var$byteToHex[arr[offset + 7]] + '-' + $46d941dbafbd459fd8c0f3ef1201321a$var$byteToHex[arr[offset + 8]] + $46d941dbafbd459fd8c0f3ef1201321a$var$byteToHex[arr[offset + 9]] + '-' + $46d941dbafbd459fd8c0f3ef1201321a$var$byteToHex[arr[offset + 10]] + $46d941dbafbd459fd8c0f3ef1201321a$var$byteToHex[arr[offset + 11]] + $46d941dbafbd459fd8c0f3ef1201321a$var$byteToHex[arr[offset + 12]] + $46d941dbafbd459fd8c0f3ef1201321a$var$byteToHex[arr[offset + 13]] + $46d941dbafbd459fd8c0f3ef1201321a$var$byteToHex[arr[offset + 14]] + $46d941dbafbd459fd8c0f3ef1201321a$var$byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
    // of the following:
    // - One or more input array values don't map to a hex octet (leading to
    // "undefined" in the uuid)
    // - Invalid input values for the RFC `version` or `variant` fields
    if (!$e4445ce001b6549dd861c1044bbb3636$export$9099ad97b570f7c(uuid)) throw TypeError('Stringified UUID is invalid');
    return uuid;
}
var $46d941dbafbd459fd8c0f3ef1201321a$export$9099ad97b570f7c = $46d941dbafbd459fd8c0f3ef1201321a$var$stringify;


function $b34a38bc0d849075d20cf20e7c9cbb98$var$v4(options, buf, offset) {
    options = options || {
    };
    var rnds = options.random || (options.rng || $746842f83862dd3a80fb8e13adc02d33$export$9099ad97b570f7c)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = rnds[6] & 15 | 64;
    rnds[8] = rnds[8] & 63 | 128; // Copy bytes to buffer, if provided
    if (buf) {
        offset = offset || 0;
        for(var i = 0; i < 16; ++i)buf[offset + i] = rnds[i];
        return buf;
    }
    return $46d941dbafbd459fd8c0f3ef1201321a$export$9099ad97b570f7c(rnds);
}
var $b34a38bc0d849075d20cf20e7c9cbb98$export$9099ad97b570f7c = $b34a38bc0d849075d20cf20e7c9cbb98$var$v4;



function $cbe2ad1457763550f6af9927987c7fe8$export$76f9b6656a0717ff(call, args = []) {
    return {
        id: $b34a38bc0d849075d20cf20e7c9cbb98$export$9099ad97b570f7c(),
        call: call,
        args: args
    };
}
function $cbe2ad1457763550f6af9927987c7fe8$export$2ec2860c66d81812(id, result, error, request) {
    const requestResult = {
        id: id
    };
    if (error) {
        requestResult.error = error;
        requestResult.original = request;
    }
    if (result) requestResult.result = result;
    return requestResult;
} //# sourceMappingURL=Utils.js.map


var $5273ce60da920d0018a81c5f2d4c1c78$exports = {};
/* moduleRaid v5
 * https://github.com/@pedroslopez/moduleRaid
 *
 * Copyright pixeldesu, pedroslopez and other contributors
 * Licensed under the MIT License
 * https://github.com/pedroslopez/moduleRaid/blob/master/LICENSE
 */ const $5273ce60da920d0018a81c5f2d4c1c78$var$moduleRaid = function() {
    $5273ce60da920d0018a81c5f2d4c1c78$var$moduleRaid.mID = Math.random().toString(36).substring(7);
    $5273ce60da920d0018a81c5f2d4c1c78$var$moduleRaid.mObj = {
    };
    fillModuleArray = function() {
        (window.webpackChunkbuild || window.webpackChunkwhatsapp_web_client).push([
            [
                $5273ce60da920d0018a81c5f2d4c1c78$var$moduleRaid.mID
            ],
            {
            },
            function(e) {
                Object.keys(e.m).forEach(function(mod) {
                    $5273ce60da920d0018a81c5f2d4c1c78$var$moduleRaid.mObj[mod] = e(mod);
                });
            }
        ]);
    };
    fillModuleArray();
    get = function get1(id) {
        return $5273ce60da920d0018a81c5f2d4c1c78$var$moduleRaid.mObj[id];
    };
    findModule = function findModule1(query) {
        results = [];
        modules = Object.keys($5273ce60da920d0018a81c5f2d4c1c78$var$moduleRaid.mObj);
        modules.forEach(function(mKey) {
            mod = $5273ce60da920d0018a81c5f2d4c1c78$var$moduleRaid.mObj[mKey];
            if (typeof mod !== 'undefined') {
                if (typeof query === 'string') {
                    if (typeof mod.default === 'object') {
                        for(key in mod.default)if (key == query) results.push(mod);
                    }
                    for(key in mod)if (key == query) results.push(mod);
                } else if (typeof query === 'function') {
                    if (query(mod)) results.push(mod);
                } else throw new TypeError('findModule can only find via string and function, ' + typeof query + ' was passed');
            }
        });
        return results;
    };
    return {
        modules: $5273ce60da920d0018a81c5f2d4c1c78$var$moduleRaid.mObj,
        constructors: $5273ce60da920d0018a81c5f2d4c1c78$var$moduleRaid.cArr,
        findModule: findModule,
        get: get
    };
};
if ("object" === 'object' && $5273ce60da920d0018a81c5f2d4c1c78$exports) $5273ce60da920d0018a81c5f2d4c1c78$exports = $5273ce60da920d0018a81c5f2d4c1c78$var$moduleRaid;
else window.mR = $5273ce60da920d0018a81c5f2d4c1c78$var$moduleRaid();


const $cc7eefdea2be830668001a2675f53239$export$168769d619198f0e = -1;
let $cc7eefdea2be830668001a2675f53239$export$bdc36877f2856e85 = null;
let $cc7eefdea2be830668001a2675f53239$export$b10c0dd0c37a51ed = null;
function $cc7eefdea2be830668001a2675f53239$export$1ae46d8c282b5fe() {
    const moduleRaid = $5273ce60da920d0018a81c5f2d4c1c78$exports();
    $cc7eefdea2be830668001a2675f53239$export$bdc36877f2856e85 = moduleRaid.findModule('Chat')[0].default;
    $cc7eefdea2be830668001a2675f53239$export$b10c0dd0c37a51ed = moduleRaid.findModule('Cmd')[0].default;
} //# sourceMappingURL=WWAProvider.js.map


function $5df67e6f80ccf75f84467a6dcb98ad3e$var$getChats() {
    return $cc7eefdea2be830668001a2675f53239$export$bdc36877f2856e85.Chat.models;
}
function $5df67e6f80ccf75f84467a6dcb98ad3e$export$493051e30ede8ad4(chatId) {
    return $5df67e6f80ccf75f84467a6dcb98ad3e$var$getChats().filter((chat)=>!chat.mute.isMute && chat.id !== chatId
    );
}
function $5df67e6f80ccf75f84467a6dcb98ad3e$export$102bfaa06fddd872(chatId) {
    return $cc7eefdea2be830668001a2675f53239$export$bdc36877f2856e85.Chat.get(chatId);
}
function $5df67e6f80ccf75f84467a6dcb98ad3e$export$7c71a3a6bebd7227(chatTitle) {
    return $cc7eefdea2be830668001a2675f53239$export$bdc36877f2856e85.Chat.models.find((chat)=>{
        return chat.title() === chatTitle;
    });
}
function $5df67e6f80ccf75f84467a6dcb98ad3e$export$457406a3a98cf305() {
    return $cc7eefdea2be830668001a2675f53239$export$bdc36877f2856e85.Chat.active();
}
function $5df67e6f80ccf75f84467a6dcb98ad3e$export$ab35766eec46a671(chat) {
    if (chat.mute.isMuted != true) chat.mute.setMute($cc7eefdea2be830668001a2675f53239$export$168769d619198f0e, false);
}
function $5df67e6f80ccf75f84467a6dcb98ad3e$export$d79374f6825fa8de(chat) {
    if (chat.mute.isMuted != false) chat.mute.setMute(0, false);
}
function $5df67e6f80ccf75f84467a6dcb98ad3e$export$a269e5013b100441(chat) {
    if (chat.archive != true) chat.archive = true;
}
function $5df67e6f80ccf75f84467a6dcb98ad3e$export$2dc24d2401c7365f(chat) {
    if (chat.archive != false) chat.archive = false;
}
function $5df67e6f80ccf75f84467a6dcb98ad3e$export$f4a8128ec2a0ed6c(chatId) {
    const chat = $cc7eefdea2be830668001a2675f53239$export$bdc36877f2856e85.Chat.get(chatId);
    $cc7eefdea2be830668001a2675f53239$export$b10c0dd0c37a51ed.openChatAt(chat);
    return chat;
}
async function $5df67e6f80ccf75f84467a6dcb98ad3e$export$43b518be2b6d92e8() {
    await $cc7eefdea2be830668001a2675f53239$export$bdc36877f2856e85.Chat.sync();
}
function $5df67e6f80ccf75f84467a6dcb98ad3e$export$e184ec158528326f() {
    return Boolean($cc7eefdea2be830668001a2675f53239$export$bdc36877f2856e85.Mute.getGlobalSounds());
}
function $5df67e6f80ccf75f84467a6dcb98ad3e$export$c28e8233adb0070b(state) {
    $cc7eefdea2be830668001a2675f53239$export$bdc36877f2856e85.Mute.setGlobalSounds(state);
}
function $5df67e6f80ccf75f84467a6dcb98ad3e$export$6883309f699d5bd0(chatId) {
    const chat = $cc7eefdea2be830668001a2675f53239$export$bdc36877f2856e85.Chat.get(chatId);
    const styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
    const styleSheet = styleEl.sheet;
    if (!styleSheet) throw new Error("No stylesheet");
    styleSheet === null || styleSheet === void 0 || styleSheet.insertRule("._21opK { display: none }", 0);
    $cc7eefdea2be830668001a2675f53239$export$b10c0dd0c37a51ed.markChatUnread(chat, 0);
    window.setTimeout(()=>styleEl.remove()
    , 10000);
} //# sourceMappingURL=WWAController.js.map



class $72054ea3922abc01a0248379ded17993$export$5be347be2439fb8 {
    static fromWWAChat(wwaChat) {
        return {
            id: wwaChat.id,
            isGroup: wwaChat.isGroup,
            name: wwaChat.name,
            title: wwaChat.title(),
            hasUnread: wwaChat.hasUnread,
            unreadCount: wwaChat.unreadCount
        };
    }
} //# sourceMappingURL=ChatFabric.js.map



const $5f59491bef83328729ff5fbe93ad469c$var$INTERVAL_MS = 100;
// State
const $5f59491bef83328729ff5fbe93ad469c$var$retentionsByChatId = new Map();
// Helpers
function $5f59491bef83328729ff5fbe93ad469c$var$getChatRetentions(chatId) {
    const retentions = $5f59491bef83328729ff5fbe93ad469c$var$retentionsByChatId.get(chatId);
    if (!retentions) return new Map();
    return retentions;
}
function $5f59491bef83328729ff5fbe93ad469c$var$retentionIsAppliedToChat(chatId, retentionType) {
    const validatorsByRetentionType = $5f59491bef83328729ff5fbe93ad469c$var$retentionsByChatId.get(chatId);
    if (!validatorsByRetentionType) return false;
    return validatorsByRetentionType.has(retentionType);
}
function $5f59491bef83328729ff5fbe93ad469c$export$1142fd4cbb1d570e(chatId, retentionType, validator, setter, cleaner) {
    if ($5f59491bef83328729ff5fbe93ad469c$var$retentionIsAppliedToChat(chatId, retentionType)) return; // Retention already applied
    // Set initially
    setter($5df67e6f80ccf75f84467a6dcb98ad3e$export$102bfaa06fddd872(chatId));
    // Update state
    const chatRetentions = $5f59491bef83328729ff5fbe93ad469c$var$getChatRetentions(chatId);
    chatRetentions.set(retentionType, {
        validator: validator,
        setter: setter,
        cleaner: cleaner
    });
    $5f59491bef83328729ff5fbe93ad469c$var$retentionsByChatId.set(chatId, chatRetentions);
}
function $5f59491bef83328729ff5fbe93ad469c$export$98434d872ed8f03(chatId, retentionType) {
    const chatRetentions = $5f59491bef83328729ff5fbe93ad469c$var$getChatRetentions(chatId);
    const effectFncs = chatRetentions.get(retentionType);
    if (!effectFncs) return;
    // Update state
    chatRetentions.delete(retentionType);
    $5f59491bef83328729ff5fbe93ad469c$var$retentionsByChatId.set(chatId, chatRetentions);
    // Set value used to chat before retention applying.
    const { cleaner: cleaner  } = effectFncs;
    cleaner($5df67e6f80ccf75f84467a6dcb98ad3e$export$102bfaa06fddd872(chatId));
}
setInterval(()=>{
    Array.from($5f59491bef83328729ff5fbe93ad469c$var$retentionsByChatId.entries()).forEach(([chatId, retentions])=>{
        const chat = $5df67e6f80ccf75f84467a6dcb98ad3e$export$102bfaa06fddd872(chatId);
        retentions.forEach(({ validator: validator , setter: setter  })=>validator(chat) && setter(chat)
        );
    });
}, $5f59491bef83328729ff5fbe93ad469c$var$INTERVAL_MS); //# sourceMappingURL=RetentionEffectChat.js.map



function $999f5a1ece7c1601612f170678cf799b$export$80f9fae01c7a1bc6(chatId) {
    // Set state
    const initialChat = $5df67e6f80ccf75f84467a6dcb98ad3e$export$102bfaa06fddd872(chatId);
    const chatArchivedByUser = initialChat.archive;
    const validator = (chat)=>{
        return chat.archive !== true;
    };
    const setter = (chat)=>{
        $5df67e6f80ccf75f84467a6dcb98ad3e$export$a269e5013b100441(chat);
    };
    const cleaner = (chat)=>{
        if (chatArchivedByUser) return;
        $5df67e6f80ccf75f84467a6dcb98ad3e$export$2dc24d2401c7365f(chat);
    };
    $5f59491bef83328729ff5fbe93ad469c$export$1142fd4cbb1d570e(initialChat.id.toString(), 'archive', validator, setter, cleaner);
}
function $999f5a1ece7c1601612f170678cf799b$export$c5f42a89b5b6d7bc(chatId) {
    $5f59491bef83328729ff5fbe93ad469c$export$98434d872ed8f03(chatId, 'archive');
}
function $999f5a1ece7c1601612f170678cf799b$export$5e5e95aa383685c6(chatId) {
    // Set state
    const initialChat = $5df67e6f80ccf75f84467a6dcb98ad3e$export$102bfaa06fddd872(chatId);
    const chatMutedByUser = initialChat.mute.isMuted;
    const validator = (chat)=>{
        return chat.mute.isMuted !== true;
    };
    const setter = (chat)=>{
        $5df67e6f80ccf75f84467a6dcb98ad3e$export$ab35766eec46a671(chat);
    };
    const cleaner = (chat)=>{
        if (chatMutedByUser) return;
        $5df67e6f80ccf75f84467a6dcb98ad3e$export$d79374f6825fa8de(chat);
    };
    $5f59491bef83328729ff5fbe93ad469c$export$1142fd4cbb1d570e(initialChat.id.toString(), 'mute', validator, setter, cleaner);
}
function $999f5a1ece7c1601612f170678cf799b$export$1ff6940fbda22674(chatId) {
    $5f59491bef83328729ff5fbe93ad469c$export$98434d872ed8f03(chatId, 'mute');
} //# sourceMappingURL=RetentionArchiveChat.js.map


// @ts-ignore
const $62d6d1afe8a78cf338e58faff70ebe6f$var$browser = chrome;
const $62d6d1afe8a78cf338e58faff70ebe6f$var$callerFunctions = new Map();
$62d6d1afe8a78cf338e58faff70ebe6f$var$callerFunctions.set($79ba1ac996accdfb0162ac0d8cb02bcc$export$a3bfcfbc59c6c960.findChatByTitle, (chatTitle)=>{
    const chat = $5df67e6f80ccf75f84467a6dcb98ad3e$export$7c71a3a6bebd7227(chatTitle);
    return chat ? $72054ea3922abc01a0248379ded17993$export$5be347be2439fb8.fromWWAChat(chat) : null; // e.g.: Phone contact without WhatsApp chat
});
$62d6d1afe8a78cf338e58faff70ebe6f$var$callerFunctions.set($79ba1ac996accdfb0162ac0d8cb02bcc$export$a3bfcfbc59c6c960.updateChatModels, (chats)=>{
    return chats.map((chat)=>{
        const updatedWWAChat = $5df67e6f80ccf75f84467a6dcb98ad3e$export$102bfaa06fddd872(chat.id);
        return $72054ea3922abc01a0248379ded17993$export$5be347be2439fb8.fromWWAChat(updatedWWAChat);
    });
});
$62d6d1afe8a78cf338e58faff70ebe6f$var$callerFunctions.set($79ba1ac996accdfb0162ac0d8cb02bcc$export$a3bfcfbc59c6c960.muteChatLocally, (chat)=>{
    $999f5a1ece7c1601612f170678cf799b$export$5e5e95aa383685c6(chat.id);
});
$62d6d1afe8a78cf338e58faff70ebe6f$var$callerFunctions.set($79ba1ac996accdfb0162ac0d8cb02bcc$export$a3bfcfbc59c6c960.unmuteChatsLocally, (chats)=>{
    for (const chat of chats)$999f5a1ece7c1601612f170678cf799b$export$1ff6940fbda22674(chat.id);
});
$62d6d1afe8a78cf338e58faff70ebe6f$var$callerFunctions.set($79ba1ac996accdfb0162ac0d8cb02bcc$export$a3bfcfbc59c6c960.muteNonMutedChatsExceptChat, (chat)=>{
    const WWAChatsForMute = $5df67e6f80ccf75f84467a6dcb98ad3e$export$493051e30ede8ad4(chat.id);
    // Mute non muted chats
    WWAChatsForMute.forEach((chat1)=>$999f5a1ece7c1601612f170678cf799b$export$5e5e95aa383685c6(chat1.id)
    );
    return WWAChatsForMute.map($72054ea3922abc01a0248379ded17993$export$5be347be2439fb8.fromWWAChat);
});
$62d6d1afe8a78cf338e58faff70ebe6f$var$callerFunctions.set($79ba1ac996accdfb0162ac0d8cb02bcc$export$a3bfcfbc59c6c960.archiveChatLocally, (chat)=>{
    $999f5a1ece7c1601612f170678cf799b$export$80f9fae01c7a1bc6(chat.id);
});
$62d6d1afe8a78cf338e58faff70ebe6f$var$callerFunctions.set($79ba1ac996accdfb0162ac0d8cb02bcc$export$a3bfcfbc59c6c960.unArchiveChatLocally, (chat)=>{
    $999f5a1ece7c1601612f170678cf799b$export$c5f42a89b5b6d7bc(chat.id);
});
$62d6d1afe8a78cf338e58faff70ebe6f$var$callerFunctions.set($79ba1ac996accdfb0162ac0d8cb02bcc$export$a3bfcfbc59c6c960.getChatById, (chatId)=>{
    const chat = $5df67e6f80ccf75f84467a6dcb98ad3e$export$102bfaa06fddd872(chatId);
    return $72054ea3922abc01a0248379ded17993$export$5be347be2439fb8.fromWWAChat(chat);
});
$62d6d1afe8a78cf338e58faff70ebe6f$var$callerFunctions.set($79ba1ac996accdfb0162ac0d8cb02bcc$export$a3bfcfbc59c6c960.openChat, (chat)=>{
    const WWAChat = $5df67e6f80ccf75f84467a6dcb98ad3e$export$f4a8128ec2a0ed6c(chat.id);
    return $72054ea3922abc01a0248379ded17993$export$5be347be2439fb8.fromWWAChat(WWAChat);
});
$62d6d1afe8a78cf338e58faff70ebe6f$var$callerFunctions.set($79ba1ac996accdfb0162ac0d8cb02bcc$export$a3bfcfbc59c6c960.getOpenedChat, ()=>{
    const chat = $5df67e6f80ccf75f84467a6dcb98ad3e$export$457406a3a98cf305();
    return chat ? $72054ea3922abc01a0248379ded17993$export$5be347be2439fb8.fromWWAChat(chat) : null;
});
$62d6d1afe8a78cf338e58faff70ebe6f$var$callerFunctions.set($79ba1ac996accdfb0162ac0d8cb02bcc$export$a3bfcfbc59c6c960.refreshWWChats, async ()=>{
    await $5df67e6f80ccf75f84467a6dcb98ad3e$export$43b518be2b6d92e8();
});
$62d6d1afe8a78cf338e58faff70ebe6f$var$callerFunctions.set($79ba1ac996accdfb0162ac0d8cb02bcc$export$a3bfcfbc59c6c960.setChatsSounds, (state)=>{
    $5df67e6f80ccf75f84467a6dcb98ad3e$export$c28e8233adb0070b(state);
});
$62d6d1afe8a78cf338e58faff70ebe6f$var$callerFunctions.set($79ba1ac996accdfb0162ac0d8cb02bcc$export$a3bfcfbc59c6c960.getChatsSoundsState, ()=>{
    return $5df67e6f80ccf75f84467a6dcb98ad3e$export$e184ec158528326f();
});
$62d6d1afe8a78cf338e58faff70ebe6f$var$callerFunctions.set($79ba1ac996accdfb0162ac0d8cb02bcc$export$a3bfcfbc59c6c960.markChatAsRead, (chatId)=>{
    $5df67e6f80ccf75f84467a6dcb98ad3e$export$6883309f699d5bd0(chatId);
});
$cc7eefdea2be830668001a2675f53239$export$1ae46d8c282b5fe();
const $62d6d1afe8a78cf338e58faff70ebe6f$var$extBridgePort = $62d6d1afe8a78cf338e58faff70ebe6f$var$browser.runtime.connect('edpkmlkdnhgboaagheijhfnphkndpekd', {
    name: $79ba1ac996accdfb0162ac0d8cb02bcc$export$ce596a179b780573.WWA_EXTERNAL_CONNECTOR
});
$62d6d1afe8a78cf338e58faff70ebe6f$var$extBridgePort.onMessage.addListener((request)=>{
    $62d6d1afe8a78cf338e58faff70ebe6f$var$handleRequest(request);
});
$62d6d1afe8a78cf338e58faff70ebe6f$var$extBridgePort.onDisconnect.addListener($62d6d1afe8a78cf338e58faff70ebe6f$var$handlePortDisconnection);
async function $62d6d1afe8a78cf338e58faff70ebe6f$var$handleRequest(request) {
    let result;
    let error;
    try {
        if ($62d6d1afe8a78cf338e58faff70ebe6f$var$callerFunctions.has(request.call)) {
            const callerFunc = $62d6d1afe8a78cf338e58faff70ebe6f$var$callerFunctions.get(request.call);
            if (request.args) result = await callerFunc(...request.args);
            else result = await callerFunc();
        } else throw new Error(`Caller ${request.call} not defined`);
    } catch (e) {
        console.error(e, "request=", request);
        error = e;
    }
    $62d6d1afe8a78cf338e58faff70ebe6f$var$extBridgePort.postMessage($cbe2ad1457763550f6af9927987c7fe8$export$2ec2860c66d81812(request.id, result, error, request));
}
function $62d6d1afe8a78cf338e58faff70ebe6f$var$handlePortDisconnection(port) {
    $5df67e6f80ccf75f84467a6dcb98ad3e$export$c28e8233adb0070b(true);
} //# sourceMappingURL=ExternalConnector.js.map

})();
