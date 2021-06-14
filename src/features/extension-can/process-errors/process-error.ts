export function process_error(errorOrErrorMessage: Error | string): void {
  // Explain: By design.
  // eslint-disable-next-line functional/no-throw-statement
  if (errorOrErrorMessage instanceof Error) throw errorOrErrorMessage;

  // Explain: By design.
  // eslint-disable-next-line no-console
  console.error(errorOrErrorMessage);
}

export function throw_DOM_error(selector: string, selectorName: string): void {
  process_error(
    Error(
      `Cannot find ${selectorName} ("${selector}") element. Check that its selector is in the DOM`,
    ),
  );
}
