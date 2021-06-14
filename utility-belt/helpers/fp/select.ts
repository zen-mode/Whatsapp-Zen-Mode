// https://medium.com/hackernoon/rethinking-javascript-eliminate-the-switch-statement-for-better-code-5c81c044716d

const executeIfFunction = (f) => (typeof f === "function" ? f() : f);

const select = (cases) => (defaultCase) => (lookupValue) =>
  cases.hasOwnProperty(lookupValue) ? cases[lookupValue] : defaultCase;

export const selectF = (cases) => (defaultCase) => (lookupValue) =>
  executeIfFunction(select(cases)(defaultCase)(lookupValue));

// Example usage:
// const selector = (string) => selectF({
//     foo: () => string + 'foo',
//     bar: () => string + 'bar',
//     baz: 'baz'
//   })(123)(string)
// selector('foo') => 'foofoo'
// selector('baz') => 'baz'
// selector('foob') => 123
