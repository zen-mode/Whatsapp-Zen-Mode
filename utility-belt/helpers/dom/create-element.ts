import {set_el_attributes} from "./set-el-attributes";

export const create = {
  checkbox(): HTMLInputElement {
    // Explain: Use 'this' here for convenience.
    // eslint-disable-next-line fp/no-this
    return this.input("checkbox");
  },
  div(text?: string): HTMLDivElement {
    const divEl = document.createElement("div");
    if (text) divEl.append(text);

    return divEl;
  },
  fragment_from_string(text: string): DocumentFragment {
    return document.createRange().createContextualFragment(text);
  },
  input(type: "checkbox" | "file" | "number" | "password"): HTMLInputElement {
    const inputEl = document.createElement("input");
    inputEl.setAttribute("type", type);

    return inputEl;
  },
  label(text: string): HTMLLabelElement {
    const labelEl = document.createElement("label");
    labelEl.append(text);

    return labelEl;
  },
  progress(options?: {value: number; max: number}): HTMLProgressElement {
    const progressEl = document.createElement("progress");
    return set_el_attributes(progressEl, options ?? {value: 0, max: 100});
  },
};
