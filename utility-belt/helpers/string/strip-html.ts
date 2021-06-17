import {create} from "../dom/create-element";

// WARNING! Browser-only.
export function strip_html_from(text: string): string {
  const divEl = create.div();

  // Explain: This is the essence of this fn.
  // eslint-disable-next-line functional/immutable-data,functional/no-expression-statement,no-unsanitized/property
  divEl.innerHTML = text;

  return divEl.innerText;
}
