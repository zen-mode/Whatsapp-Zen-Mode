const CONTEXT_MENU_BOTTOM_MARGIN = 32;

const fixContextMenuPosition = (htmlEl: HTMLElement, targetHeight: number) => {
  const rect = htmlEl.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  if (rect.top + targetHeight > viewportHeight && !htmlEl.style.bottom) {
    htmlEl.style.top = `${viewportHeight - targetHeight - CONTEXT_MENU_BOTTOM_MARGIN}px`;
  }
};

export {fixContextMenuPosition};
