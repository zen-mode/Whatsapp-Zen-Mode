import browser from "webextension-polyfill";
import { Chat } from "./model/Chat";

function injectContainerInChat() {
    let chatMessagesDiv = document.getElementsByClassName('_2gzeB')[0];
    if (chatMessagesDiv 
      && !chatMessagesDiv.querySelector('#inchat-status-container')) {
        const div = document.createElement('div');
        div.id = 'inchat-status-container';
        chatMessagesDiv.append(div)
        return true
    }
    return false
}

function createStatusItem(chat: Chat) {
   const main = document.createElement('div');
   main.className = 'inchat-status-item';
   const container = document.createElement('div');
   container.className = 'inchat-status-item-container';
   const body = document.createElement('div');
   body.innerHTML = `
<span style="
   font-size: 12px;
   vertical-align: super;
   height: .75em;
   line-height: .75em;
">${chat.title}</span>
<img src="${browser.runtime.getURL('assets/whatsapp/message.png')}" style="
   height: 19px;
   width: 19px;
   transform: translateY(10%);
">
<span style="
   line-height: 11px;
   height: 13px;
   width: 13px;
   background-color: red;
   position: absolute;
   font-size: 8px;
   box-shadow: rgb(68 68 68) 0px 0px 1px;
   border-radius: 50%;
   transform: translateX(-21px);
   text-align: center;
">11</span>
   `;
   body.className = 'inchat-status-item-body';
   container.append(body);
   main.append(container);
   return main;
}

setInterval(function() {
   if (injectContainerInChat()) {
      document.getElementById('inchat-status-container')?.append(
         createStatusItem('Someone in Startups is typing...'),
         createStatusItem('Bill Gates is typing...'),
         createStatusItem('Elon Musk'),
      )
   }
}, 100)
