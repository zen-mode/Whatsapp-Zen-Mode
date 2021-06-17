/* eslint-env webextensions */

interface IMenuItemGeneric {
  parentId?: string;
  id: string;
  enabled?: boolean;
  contexts?: string[];
}
interface ITextItem extends IMenuItemGeneric {
  text?: string;
}
interface ISeparatorItem extends IMenuItemGeneric {
  type?: "separator";
}
export interface CMItem extends IMenuItemGeneric, ITextItem, ISeparatorItem {}

// TODO-3: sort out types
// https://stackoverflow.com/questions/57840975/how-to-write-a-type-that-uses-either-of-two-interfaces
/**
 * @description: Adds browser context menu item
 * @exampleInput: {
    parentId: "topMenu",
    id: "principalShortName",
    text: "ООО Жирафик",
    contexts: ["editable"]
  }
 * @exampleOutput: void
 * @sideEffects: browser API
 * @hasTests: false
 */
export function add_CTX_MENU_item({
  parentId,
  id,
  text,
  type,
  enabled,
  contexts,
}: CMItem): void {
  try {
    // todo-5: fix errors that pop up in BA main tab if reloading page
    //   chrome.contextMenus.remove(id, () =>
    chrome.contextMenus.create({
      parentId,
      id,
      title: text,
      type,
      enabled,
      contexts,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

/**
 * @description: Adds browser context menu item
 * @exampleInput: {
    parentId: "topMenu",
    id: "principalShortName",
    text: "ООО Жирафик",
    contexts: ["editable"]
  }
 * @exampleOutput: void
 * @sideEffects: browser API
 * @hasTests: false
 */
export function update_CTX_MENU_item(params: CMItem): void {
  chrome.contextMenus.update(params.id, {
    title: params.text,
    // eslint-disable-next-line no-prototype-builtins
    enabled: params.hasOwnProperty("enabled") ? params.enabled : true,
  });
}
