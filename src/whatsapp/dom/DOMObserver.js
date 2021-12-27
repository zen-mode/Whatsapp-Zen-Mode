export function observerOn(observer, target, matcher, oOptions = {}) {
  if (matcher()) {
    observer.observe(target(), oOptions);
  } else {
    setTimeout(() => observerOn(observer, target, matcher, oOptions), 50);
  }
}
