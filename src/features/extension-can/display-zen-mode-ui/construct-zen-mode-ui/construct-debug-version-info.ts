import { set_el_attributes } from "../../../../../utility-belt/helpers/dom/set-el-attributes";
import { Selectors } from "../../../../data/dictionary";

export function constructDebugVersionInfo(): HTMLDivElement {
    const el = document.createElement("div");
    set_el_attributes(el, {
        id: Selectors.ZM_DEBUG_MODE_INDICATOR.substring(1),
    });
    el.innerText="";
    el.style.margin = "0 10px";
    return el
}