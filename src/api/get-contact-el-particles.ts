import {process_error} from "../features/extension-can/process-errors/process-error";
import {Selectors} from "../data/dictionary";

export function get_contact_el_particles_AND_is_it_read(
  contactEl: Element | any,
): {
  nameEl: Element;
  timeEl: Element;
  bottomSectionEl: Element;
  lastMsgEl: Element;
} {
  if (!contactEl) process_error(
    Error(`Contact element is required.`),
  );
  const [topSectionEl, bottomSectionEl] = contactEl.children;
  if (!topSectionEl || !bottomSectionEl) {
    throw new Error('Contact element need includes top and bottom sections');
  }
  const [nameEl, timeEl, lastMsgEl] = [
    topSectionEl?.querySelector(Selectors.WA_CONTACT_NAME),
    topSectionEl?.children[1],
    bottomSectionEl?.children[0]
  ];
  // prettier-ignore
  // eslint-disable-next-line max-len
  return { nameEl, timeEl, lastMsgEl, bottomSectionEl };
}
