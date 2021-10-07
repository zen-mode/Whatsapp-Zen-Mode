const CONTEXT_MENU_BOTTOM_MARGIN = 32;

const fixContextMenuPosition = (htmlEl: HTMLElement, targetHeight: number) => {
  const rect = htmlEl.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const heightLimit = viewportHeight - CONTEXT_MENU_BOTTOM_MARGIN;
  if (rect.top + targetHeight > heightLimit && !htmlEl.style.bottom) {
    htmlEl.style.top = `${heightLimit - targetHeight}px`;
  }
};

export {fixContextMenuPosition};
