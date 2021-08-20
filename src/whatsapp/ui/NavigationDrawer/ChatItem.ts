import {Chat} from "../../model/Chat";
import {browser} from "webextension-polyfill-ts";
import {getProfilePicUrl} from "../../ExtensionConnector";

export interface ChatItem {
  readonly htmlElement: HTMLElement;
}

const PROFILE_PIC_ID = 'profile-pic';

const PROFILE_PIC = browser.runtime.getURL("assets/whatsapp/profile.svg");
const GROUP_PIC = browser.runtime.getURL("assets/whatsapp/group.svg");

export function constructChatItem(chat: Chat, onClick?: () => void, onArrow?: () => void, tags: string[] = []): ChatItem {
  const pic = chat.isGroup ? GROUP_PIC : PROFILE_PIC;

  const arrowHTML = onArrow ? `<button class="_2fQtj" aria-label="Open the chat context menu" aria-hidden="true" style="width: 20px; opacity: 1;">
                <span data-icon="down">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 20" width="19" height="20"><path fill="currentColor" d="M3.8 6.7l5.7 5.7 5.7-5.7 1.6 1.6-7.3 7.2-7.3-7.2 1.6-1.6z"></path></svg>
                </span>
              </button>` : '';
  const tagsHTML = tags.map(value => `<span class="_1pJ9J  _3f7yK">${value}</span>`)
    .join('');
  const unreaderHTML = chat.hasUnread ? `<div class="_1pJ9J" style="transform: scaleX(1) scaleY(1); opacity: 1;">
                                            <span class="_23LrM">${chat.unreadCount}</span>
                                        </div>` : '';
  const previewHTML = chat.previewMessage ? `<span class="Hy9nV" title="${chat.previewMessage}">
                                              <span dir="ltr" class="_ccCW FqYAR i0jNr">${chat.previewMessage}</span>
                                            </span>` : '';

  const div = document.createElement('div');
  div.className = '_3m_Xw';
  div.style.zIndex = '0';
  div.style.height = '72px';
  div.oncontextmenu = function (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  div.innerHTML = `
    <div tabindex="-1" aria-selected="false" role="row">
      <div data-testid="cell-frame-container" class="_2nY6U">
        <div class="_2EU3r">
          <div class="HONz8">
            <div class="_3GlyB" style="height: 49px; width: 49px;">
              <div class="_1lPgH">
                <span>
                  <img id="${PROFILE_PIC_ID}" src="${pic}" class="_8hzr9 M0JmA i0jNr" width="100%" height="100%"/>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="_3OvU8">
          <div role="gridcell" aria-colindex="2" class="_3vPI2">
            <div class="zoWT4">
                <span dir="auto" title="${chat.title}" class="_ccCW FqYAR i0jNr">${chat.title}</span>
            </div>
            <div class="_3dulN"></div>
          </div>
          <div class="_37FrU">
            <div class="_1qB8f">
              <span class="Hy9nV">
                <div class="_ccCW FqYAR i0jNr">${previewHTML}</div>
              </span>
          </div>
          <div role="gridcell" aria-colindex="1" class="_1i_wG">
            <span>${tagsHTML}</span>
            <span>${unreaderHTML}</span>
            <span>${arrowHTML}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  getProfilePicUrl(chat, (picUrl) => {
    if (picUrl) {
      div.querySelector('#' + PROFILE_PIC_ID)!!.setAttribute('src', picUrl);
    }
  });

  if (onClick) {
    div.addEventListener('click', onClick);
  }
  if (onArrow) {
    div.getElementsByClassName('_2fQtj')[0]!!.addEventListener('click', onArrow);
  }

  return {
    htmlElement: div,
  };
}
