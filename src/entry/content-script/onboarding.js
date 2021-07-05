import { browser } from 'webextension-polyfill-ts';

// Render
const titleEl = document.getElementById('titleOnboarding');
const descEl = document.getElementById('descriptionOnboarding');
const agreeEl = document.getElementById('agreeOnboarding');
const disagreeEl = document.getElementById('disagreeOnboarding');

function constructLocales() {
  titleEl.textContent = browser.i18n.getMessage('ZM_onboarding_page_title');
  descEl.textContent = browser.i18n.getMessage('ZM_onboarding_page_desc');
  agreeEl.textContent = browser.i18n.getMessage('ZM_onboarding_page_agree');
  disagreeEl.textContent = browser.i18n.getMessage('ZM_onboarding_page_disagree');
}
constructLocales();

// Set listeners
agreeEl.addEventListener('click', function() {
  browser.runtime.sendMessage({ action: 'reload-whatsapp' })
});

disagreeEl.addEventListener('click', function() {
  browser.runtime.sendMessage({ action: 'close-onboarding-page' })
});
