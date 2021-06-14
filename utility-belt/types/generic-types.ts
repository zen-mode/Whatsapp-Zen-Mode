export type GenericFn = (...arg: unknown[]) => unknown;

export type GenericObject = Record<string, unknown>;
export type EmptyObject = Record<string, never>;
export type StringObject = Record<string, string>;

// Use: ObjectValuesUnionOf<typeof someObject>.
export type ObjectValuesUnionOf<T> = T[keyof T];

export type SelectComponentEntry = Readonly<{value: string; text: string}>;

export type ArrayElement<T extends unknown[]> = T extends readonly (infer ArrayElement)[]
  ? ArrayElement
  : never;
export type NonEmptyArray<T> = [T, ...T[]];
