// Description: Constructs the UI of the release notes widget

import {DOM} from "../../../../utility-belt/helpers/dom/DOM-shortcuts";
import {set_el_style} from "../../../../utility-belt/helpers/dom/set-el-style";

import {Selectors} from "../../../data/dictionary";
// @ts-expect-error smth wrong with globals.d.ts.
import releaseNotes from "../../../../RELEASE-NOTES.yaml";
import {ReleaseNotes} from "../../../data/types";
import browser from "webextension-polyfill";

export function construct_release_notes_area(): HTMLDivElement {
  const manifest = browser.runtime.getManifest();
  const releaseNotesAreaEl = DOM.create_el({
    tag: "div",
    attributes: {
      id: Selectors.ZM_RELEASE_NOTES_AREA.substring(1),
      class: '_3J6wB',
    },
  });

  const headerEl = DOM.create_el({
    tag: "h1",
    text: `${browser.i18n.getMessage("ZM_releaseNotes")} ${manifest.version}`
  });
  releaseNotesAreaEl.appendChild(headerEl);

  // Explain: We'll keep support for multiple RNs in release-notes.yaml.
  // But in current ver we only use one RN.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const release = (releaseNotes as ReleaseNotes).release;
  const description = release.description;
  const changes = release.changes;
  const link = release.link;

  const releaseNotesDescriptionEl = DOM.create_el({tag: "div"});
  releaseNotesDescriptionEl.innerHTML = description;
  releaseNotesAreaEl.appendChild(releaseNotesDescriptionEl);

  const releaseNotesListEl = DOM.create_el({tag: "ul"});
  releaseNotesAreaEl.appendChild(releaseNotesListEl);

  changes.forEach((descr, i) => {
    const noteEl = DOM.create_el({tag: "li", html: descr});
    releaseNotesListEl.appendChild(noteEl);
  });

  const linkEl = DOM.create_el({tag: "div"});
  linkEl.innerHTML = link
  releaseNotesListEl.appendChild(linkEl);

  const closeBtnEl = DOM.create_el({
    tag: "div",
    text: "x",
    attributes: {id: Selectors.ZM_RELEASE_NOTES_AREA_CLOSE_BTN.substring(1)},
  });
  closeBtnEl.addEventListener("click", () =>
    set_el_style(releaseNotesAreaEl, {display: "none"}),
  );
  releaseNotesAreaEl.appendChild(closeBtnEl);
  window.addEventListener('click', (e) => {
    if ((e.target as Element).closest(Selectors.ZM_RELEASE_NOTES_AREA)) {
      return;
    }
    set_el_style(releaseNotesAreaEl, {display: "none"});
  });

  return releaseNotesAreaEl as HTMLDivElement;
}
