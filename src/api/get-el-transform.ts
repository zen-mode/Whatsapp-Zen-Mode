export function get_el_transform(element: Element): number {
  // @ts-expect-error; dom.lib.ts is not aware of this api yet.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  return element.computedStyleMap().get("transform")[0].y.value as number;
}
