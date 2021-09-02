import browser from 'webextension-polyfill';

// Render
const titleEl = document.getElementById('titleOnboarding');
const agreeEl = document.getElementById('agreeOnboarding');

function constructLocales() {
  titleEl.textContent = browser.i18n.getMessage('ZM_onboarding_page_title');
  agreeEl.textContent = browser.i18n.getMessage('ZM_onboarding_page_agree');
}
constructLocales();

// Set listeners
agreeEl.addEventListener('click', function() {
  window.close()
});