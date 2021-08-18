import {Chat} from "../model/Chat";
import {DOM} from "../../../utility-belt/helpers/dom/DOM-shortcuts";
import {devprint} from "../../../utility-belt/helpers/debug/devprint";
import {constructBaseLeftDrawerItemList, LeftDrawerItemList} from "./LeftDrawerItemList";
import {subscribeForeverHiddenChatChanges, removeHiddenChats} from "../Storage";
import {browser} from "webextension-polyfill-ts";
import {HiddenChatCtxMenu} from "./FakeCtxMenu/HiddenChatCtxMenu";
import { openChat } from "../ExtensionConnector";

const EMPTY_HIDDEN_CHATS_LIST_PLUG_ID = 'EMPTY_HIDDEN_CHATS_LIST_PLUG_ID';

const USER_CHAT_SVG_HTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="212" height="212">
  <path fill="#DFE5E7" class="background" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path>
  <path fill="#FFF" class="primary" d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path>
</svg>`;
const GROUP_CHAT_SVG_HTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="212" height="212">
  <path fill="#DFE5E7" class="background" d="M105.946.25C164.318.25 211.64 47.596 211.64 106s-47.322 105.75-105.695 105.75C47.571 211.75.25 164.404.25 106S47.571.25 105.946.25z"></path>
  <path fill="#FFF" class="primary" d="M61.543 100.988c8.073 0 14.246-6.174 14.246-14.246s-6.173-14.246-14.246-14.246-14.246 6.173-14.246 14.246 6.174 14.246 14.246 14.246zm8.159 17.541a48.192 48.192 0 0 1 8.545-6.062c-4.174-2.217-9.641-3.859-16.704-3.859-21.844 0-28.492 15.67-28.492 15.67v8.073h26.181l.105-.248c.303-.713 3.164-7.151 10.365-13.574zm80.755-9.921c-6.854 0-12.21 1.543-16.336 3.661a48.223 48.223 0 0 1 8.903 6.26c7.201 6.422 10.061 12.861 10.364 13.574l.105.248h25.456v-8.073c-.001 0-6.649-15.67-28.492-15.67zm0-7.62c8.073 0 14.246-6.174 14.246-14.246s-6.173-14.246-14.246-14.246-14.246 6.173-14.246 14.246 6.173 14.246 14.246 14.246zm-44.093 3.21a23.21 23.21 0 0 0 4.464-.428c.717-.14 1.419-.315 2.106-.521 1.03-.309 2.023-.69 2.976-1.138a21.099 21.099 0 0 0 3.574-2.133 20.872 20.872 0 0 0 5.515-6.091 21.283 21.283 0 0 0 2.121-4.823 22.16 22.16 0 0 0 .706-3.193c.16-1.097.242-2.224.242-3.377s-.083-2.281-.242-3.377a22.778 22.778 0 0 0-.706-3.193 21.283 21.283 0 0 0-3.272-6.55 20.848 20.848 0 0 0-4.364-4.364 21.099 21.099 0 0 0-3.574-2.133 21.488 21.488 0 0 0-2.976-1.138 22.33 22.33 0 0 0-2.106-.521 23.202 23.202 0 0 0-4.464-.428c-12.299 0-21.705 9.405-21.705 21.704 0 12.299 9.406 21.704 21.705 21.704zM145.629 131a36.739 36.739 0 0 0-1.2-1.718 39.804 39.804 0 0 0-3.367-3.967 41.481 41.481 0 0 0-3.442-3.179 42.078 42.078 0 0 0-5.931-4.083 43.725 43.725 0 0 0-3.476-1.776c-.036-.016-.069-.034-.104-.05-5.692-2.581-12.849-4.376-21.746-4.376-8.898 0-16.055 1.795-21.746 4.376-.196.089-.379.185-.572.276a43.316 43.316 0 0 0-3.62 1.917 42.32 42.32 0 0 0-5.318 3.716 41.501 41.501 0 0 0-3.443 3.179 40.632 40.632 0 0 0-3.366 3.967c-.452.61-.851 1.186-1.2 1.718-.324.493-.6.943-.841 1.351l-.061.101a27.96 27.96 0 0 0-.622 1.119c-.325.621-.475.975-.475.975v11.692h82.53v-11.692s-.36-.842-1.158-2.195a35.417 35.417 0 0 0-.842-1.351z"></path>
</svg>`;
const ARROW_CTX_MENU_HTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 20" width="19" height="20"><path fill="currentColor" d="M3.8 6.7l5.7 5.7 5.7-5.7 1.6 1.6-7.3 7.2-7.3-7.2 1.6-1.6z"></path></svg>`;

let hiddenChatsDrawer: LeftDrawerItemList<Chat>;
const hiddenChatCtxMenu = new HiddenChatCtxMenu([
  {
    action: 'unhide',
    domNode: browser.i18n.getMessage('WA_contactCtxMenuItem_unhide'),
    chatChange: removeHiddenChats
  }
]);

function constructBasicChatListElement(chat: Chat): HTMLElement {
  devprint('constructBasicChatListElement=', chat);
  const chatSVGBlankPic = chat.isGroup ? GROUP_CHAT_SVG_HTML : USER_CHAT_SVG_HTML;

  const div = document.createElement('DIV');
  div.className = '_3m_Xw hiddenChatEl';
  // Styles
  div.style.zIndex = '0';
  div.style.transition = 'transition: none 0s ease 0s';
  div.style.height = '72px';
  div.style.transform = 'translateY(0px)';
  div.innerHTML = `<div tabindex="-1" aria-selected="false" role="row">
               <div data-testid="cell-frame-container" class="_2nY6U">
                  <div class="_2EU3r">
                    <div class="HONz8">
                        <div class="_3GlyB" style="height: 49px; width: 49px;">
                          <div class="_1lPgH">
                             <span data-testid="default-group" data-icon="default-group" class="">
                                ${chatSVGBlankPic}
                            </span>
                          </div>
                        </div>
                    </div>    
                  </div>
                  <div class="_3OvU8">
                     <div role="gridcell" aria-colindex="2" class="_3vPI2">
                        <div class="zoWT4"><span dir="auto" title="${chat.title}" class="_ccCW FqYAR i0jNr">${chat.title}</span></div>
                        <div class="_3dulN"></div>
                     </div>
                     <div class="_37FrU">
                        <div class="_1qB8f">
                           <span class="Hy9nV" title="‬">
                              <div class="_2qo4q _3NIfV"><span dir="ltr" class="_3-8er"></span></div>
                           </span>
                        </div>
                        <div role="gridcell" aria-colindex="1" class="_1i_wG">
                          <span><span class="_1pJ9J  _3f7yK">${browser.i18n.getMessage('ZM_hidden')}</span></span>
                          <span></span>
                          <span>
                            <button class="dNJHX" data-action="fakeCtxMenu">
                              <span data-testid="down" data-icon="down">${ARROW_CTX_MENU_HTML}</span>
                            </button>
                          </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>`;
  div.addEventListener('click', e1 => {
    // @ts-ignore
    const targetButton = e1.target.closest('[data-action]');
    if (!targetButton) {
      openChat(chat);
      return
    };
    switch (targetButton.dataset.action) {
      case 'fakeCtxMenu': {
        e1.stopPropagation();
        if (hiddenChatCtxMenu.chat?.id === chat.id) {
          hiddenChatCtxMenu.detachChat(chat);
        } else {
          hiddenChatCtxMenu.attachToChat(chat, targetButton.getBoundingClientRect());
        }
      }
    }
  });
  div.oncontextmenu = e => {
    e.preventDefault();
    e.stopPropagation();
    hiddenChatCtxMenu.attachToChat(chat, {
      bottom: e.clientY,
      left: e.clientX,
      right: e.clientX,
      top: e.clientY,
      height: 0,
      width: 0
    });
  }

  return div;
}

function constructEmptyPlug(): HTMLElement {
  document.body.insertAdjacentHTML('afterbegin', `
        <div id="${EMPTY_HIDDEN_CHATS_LIST_PLUG_ID}" class="_3Iwj9">
            <div class="_2t_t3">
               <span data-testid="empty-archived" data-icon="empty-archived" class="">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" width="90" height="90">
                     <path fill="currentColor" d="M71.109 24.113l-4.288-5.222c-.594-.934-1.825-1.528-3.396-1.528h-36.85a5.083 5.083 0 0 0-3.693 1.528l-3.991 5.222c-.934 1.231-1.528 2.462-1.528 3.991v38.377a6.16 6.16 0 0 0 6.156 6.156h42.962a6.16 6.16 0 0 0 6.156-6.156V28.104c0-1.529-.595-2.76-1.528-3.991zM45.042 61.896L28.146 45h10.741v-6.156h12.269V45h10.741L45.042 61.896zM23.859 23.519l2.462-3.057H63.17l2.759 3.057h-42.07z"></path>
                  </svg>
               </span>
            </div>
            <div class="_2Vemb">${browser.i18n.getMessage('ZM_noHiddenChats')}</div>
         </div>
      `);
  return DOM.get_el('#' + EMPTY_HIDDEN_CHATS_LIST_PLUG_ID)!!
}

export function presentHiddenChatsLeftDrawer(hiddenChats: Chat[]): LeftDrawerItemList<Chat> {
  if (hiddenChatsDrawer) {
    hiddenChatsDrawer.close();
  }
  hiddenChatsDrawer = constructBaseLeftDrawerItemList(
    browser.i18n.getMessage('ZM_hiddenChats'),
    hiddenChats,
    () => {},
    constructBasicChatListElement,
    () => {},
    constructEmptyPlug
  );
  hiddenChatsDrawer.open();
  return hiddenChatsDrawer;
}

subscribeForeverHiddenChatChanges((hiddenChats) => {
  if (hiddenChatsDrawer)
    hiddenChatsDrawer.set(hiddenChats);
})
