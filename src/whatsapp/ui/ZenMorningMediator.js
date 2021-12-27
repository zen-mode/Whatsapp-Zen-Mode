import * as DOMConstants from "../dom/DOMConstants";

const sunNode = (() => {
  const s = document.createElement('div');
  s.innerText = '\uD83C\uDF1E';
  s.id = DOMConstants.ZEN_MORNING_SUN_ID;
  return s;
})();

export function setSunTo(chatNode) {
  chatNode.infoContainer().append(sunNode);
}

export function clearSun(element) {
  if (element.querySelector('#' + DOMConstants.ZEN_MORNING_SUN_ID)) {
    sunNode.remove();
  }
}
