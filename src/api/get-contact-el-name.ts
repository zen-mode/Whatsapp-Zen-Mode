import {get_contact_el_particles_AND_is_it_read} from "./get-contact-el-particles";

export function get_chat_el_raw_title(el: Element): string {
  return get_contact_el_particles_AND_is_it_read(
    el,
    // Explain: No need to clean textContent here because it already doesn't include icons;
    // because they are not inlined -unlike in title attribute- but represented with <img>'s.
  ).nameEl.getAttribute('title') as string;
}
