import {Chat} from "../../model/Chat";
import browser from "webextension-polyfill";
import {getProfilePicUrl} from "../../ExtensionConnector";

export interface ChatItem {
  readonly htmlElement: HTMLElement;
}

const CHAT_ID = 'fake-chat-container';
const PROFILE_PIC_ID = 'profile-pic';
const ARROW_BUTTON_ID = 'fake-arrow-button';

const PROFILE_PIC = browser.runtime.getURL("assets/whatsapp/profile.svg");
const GROUP_PIC = browser.runtime.getURL("assets/whatsapp/group.svg");

export function constructChatItem(chat: Chat, onClick?: () => void, onArrow?: (e: any) => void, tags: string[] = []): ChatItem {
  const pic = chat.isGroup ? GROUP_PIC : PROFILE_PIC;
  
  const chatTitle = `
  <span dir="auto" title="${chat.name}" class="ggj6brxn gfz4du6o r7fjleex g0rxnol2 lhj4utae le5p0ye3 l7jjieqr i0jNr">
    ${chat.title}
  </span>
  `

  const arrowHTML = onArrow ? `
  <button id="${ARROW_BUTTON_ID}" class="l7jjieqr qg8w82as jdwybkuq qnz2jpws s4k44ver fewfhwl7" aria-label="Open the chat context menu" aria-hidden="true" tabindex="0" style="width: 20px; opacity: 1;" pointerevents="none">
    <span data-testid="down" data-icon="down" class="">
        <svg viewBox="0 0 19 20" width="19" height="20" class="">
          <path fill="currentColor" d="m3.8 6.7 5.7 5.7 5.7-5.7 1.6 1.6-7.3 7.2-7.3-7.2 1.6-1.6z"></path>
        </svg>
    </span>
  </button>
  ` : '';

  const tagsHTML = tags.map(value => `
  <span class="_1pJ9J _3f7yK">${value}</span>`)
  .join('');

  const unreaderHTML = chat.hasUnread || chat.unreadCount === -1 ? `
  <div class="_1pJ9J">
    <span class="l7jjieqr cfzgl7ar ei5e7seu h0viaqh7 tpmajp1w c0uhu3dl riy2oczp dsh4tgtl sy6s5v3r gz7w46tb lyutrhe2 qfejxiq4 fewfhwl7 ovhn1urg ap18qm3b ikwl5qvt j90th5db aumms1qt" aria-label="">
    ${chat.unreadCount > 0 ? chat.unreadCount:''}
    </span>
  </div>
  ` : '';
  
  const previewHTML = chat.previewMessage ? `
  <span class="Hy9nV" title="${chat.previewMessage}">
    <span dir="auto" class="ggj6brxn gfz4du6o r7fjleex g0rxnol2 lhj4utae le5p0ye3 l7jjieqr i0jNr">
      ${chat.previewMessage}
    </span>
  </span>
  ` : '';

  const div = document.createElement('div');
  div.id = CHAT_ID;
  div.innerHTML = `
  <div class="_3m_Xw" style="z-index: 0; transition: none 0s ease 0s; height: 72px; transform: translateY(0px);">
    <div tabindex="-1" aria-selected="false" role="row">
      <div data-testid="cell-frame-container" class="_2nY6U vq6sj _3C4Vf">
        <div class="_2EU3r">
           <div class="HONz8">
            <div class="_3GlyB" style="height: 49px; width: 49px;">
              <img id="${PROFILE_PIC_ID}" src="${pic}" alt="" draggable="false" class="_8hzr9 M0JmA i0jNr" style="visibility: visible;">
            </div>
           </div>
        </div>
        <div class="_3OvU8">
           <div role="gridcell" aria-colindex="2" class="_3vPI2">
              <div class="zoWT4">${chatTitle}</div>
              <div class="_1i_wG"></div>
           </div>
           <div class="_37FrU">
              <div class="_1qB8f">${previewHTML}</div>
              <div role="gridcell" aria-colindex="1" class="_1i_wG">
                <span>${tagsHTML}</span>
                <span>${unreaderHTML}</span>
                <span>${arrowHTML}</span>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
  `;

  getProfilePicUrl(chat, (picUrl) => {
    if (picUrl) {
      const pic = div.querySelector('#' + PROFILE_PIC_ID);
      if (pic) {
        pic.setAttribute('src', picUrl);
      }
    }
  });

  div.oncontextmenu = function (e) {
    e.stopPropagation();
    e.preventDefault();
  }

  if (onClick) {
    div.addEventListener('click', onClick);
  }
  
  if (onArrow) {
    const button = div.querySelector('#' + ARROW_BUTTON_ID);
    if (button) {
      button.addEventListener('click', onArrow);
    } 
  }

  return {
    htmlElement: div,
  };
}
