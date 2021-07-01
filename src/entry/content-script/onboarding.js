import {browser} from "webextension-polyfill-ts";

const titleEl = document.getElementById('titleOnboarding');
const descEl = document.getElementById('descriptionOnboarding');
const agreeEl = document.getElementById('agreeOnboarding');
const disagreeEl = document.getElementById('disagreeOnboarding');

function constructPopupDescription() {
    const text = browser.i18n.getMessage("ZM_onboarding_page_desc");
    return text;
}

function constructPopupBtns() {
    const text_agree = browser.i18n.getMessage("ZM_onboarding_page_agree");
    const text_disagree = browser.i18n.getMessage("ZM_onboarding_page_disagree");
    return {
        text_agree,
        text_disagree
    };
}

titleEl.textContent = constructPopupDescription();
descEl.textContent = constructPopupDescription();
agreeEl.textContent = constructPopupBtns().text_agree;
disagreeEl.textContent = constructPopupBtns().text_disagree;


agreeEl.addEventListener('click', function() {
    browser.runtime.sendMessage({action: 'reload-whatsapp'})
})

disagreeEl.addEventListener('click', function() {
    browser.runtime.sendMessage({action: 'close-onboarding-page'})
})