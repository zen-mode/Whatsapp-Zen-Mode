// Obsolete, because a more elegant way to remove font-weight style is implemented in ..
// Unhide all handler.. Will keep for ref until 01.01.22.

// Description:
// 0. Sets an interval timer to check if user is logged in.
// 1. Attaches click event listeners to contact elements.
// 1.1 On click - remove custom styling (font weight) from contact name - IF it is not in Hidden list.
// Because we want clicked contacts to be handled by WAW default mechanism; i.e. become read.

import {DOM} from "../../../utility-belt/helpers/dom/DOM-shortcuts";
import {get_contact_el_particles_AND_is_it_read} from "../../api/get-contact-el-particles";
import {el_is_a_hidden_contact} from "../../api/el-is-a-hidden-contact";
import {devprint} from "../../../utility-belt/helpers/debug/devprint";

import {Selectors} from "../../data/dictionary";
import {TIME} from "../../../utility-belt/constants/time";

// 0. Sets an interval timer to check if user is logged in.
const intervalId = setInterval(attach_event_listeners, TIME.TENTH_OF_A_SECOND);
devprint("STATUS: Waiting for user to log in to attach event listeners.");

function attach_event_listeners(): void {
  const contactListEl = DOM.get_el(Selectors.WA_CONTACT_LIST);
  if (!contactListEl) return;

  // 1. Attaches click event listeners to contact elements.
  const contactEls = DOM.get_els(Selectors.WA_CONTACTS);

  // noinspection JSVoidFunctionReturnValueUsed
  contactEls.forEach(
    (el) =>
      // Explain: This rule is broken.
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      void el.addEventListener("click", async () => {
        // Explain: If contact is hidden - no need to change its style, because it should remain non-bold.
        const contactIsHidden = await el_is_a_hidden_contact(el);
        if (contactIsHidden) return;

        // 1.1 On click - remove custom styling (font weight) from contact name - IF it is not in Hidden list.
        const {nameEl} = get_contact_el_particles_AND_is_it_read(el);
        nameEl.removeAttribute("style");
      }),
  );

  devprint("STATUS: Event listeners attached.");

  clearInterval(intervalId);
}
