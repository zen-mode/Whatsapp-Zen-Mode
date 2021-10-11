import {devprint} from "../../../../utility-belt/helpers/debug/devprint";

const CONTEXT_MENU_BOTTOM_MARGIN = 32;
const MENU_PADDING = 9;
const MENU_ITEM_HEIGHT = 40;

const fixContextMenuPosition = (htmlEl: HTMLElement, customItemsCount: number) => {
  const nativeItemsCount = htmlEl.querySelectorAll("._2qR8G._1wMaz._18oo2").length;
  const targetHeight =
    (customItemsCount + nativeItemsCount) * MENU_ITEM_HEIGHT + MENU_PADDING * 2;
  const rect = htmlEl.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const heightLimit = viewportHeight - CONTEXT_MENU_BOTTOM_MARGIN;
  if (rect.top + targetHeight >= heightLimit && !htmlEl.style.bottom) {
    htmlEl.style.top = `${heightLimit - targetHeight}px`;
  }
};

export {fixContextMenuPosition};
