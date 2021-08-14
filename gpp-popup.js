/* popup.js */

import { getOptions, saveOptions } from './storage.js';

function initForm (options) {
  const formatItems = document.querySelectorAll('div.formats input');
  for (const item of formatItems) {
    if (item.value === options.format) {
      item.checked = true;
    }
  }
  document.querySelector('button[type="submit"]').focus();
}

function checkUrlProtocol (tab) {
  if (tab.url.indexOf('http:') === 0 || tab.url.indexOf('https:') === 0) {
    document.querySelector("#popup-content").classList.remove("hidden");
    getOptions().then(initForm);
  }
  else {
    document.querySelector("#error-content").classList.remove("hidden");
  }
}

getActiveTab().then(checkUrlProtocol);

/* ---------------------------------------------------------------- */

/*
**  copyPageLink: Called when form is submitted. Note: The form is
**  displayed only when checkUrlProtocol allows.
*/
function copyPageLink (tab) {
#ifdef FIREFOX
  browser.tabs.executeScript(null, { file: 'content.js' });
#endif
#ifdef CHROME
  chrome.tabs.executeScript(null, { file: 'content.js' });
#endif
  window.close();
}

/* ---------------------------------------------------------------- */

#ifdef CHROME
// Redefine console for Chrome extension
var console = chrome.extension.getBackgroundPage().console;

function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    console.log(chrome.runtime.lastError.message);
    return false;
  }
}
#endif

function getActiveTab () {
  return new Promise (function (resolve, reject) {
#ifdef FIREFOX
    let promise = browser.tabs.query({ currentWindow: true, active: true });
    promise.then(
      tabs => { resolve(tabs[0]) },
      msg => { reject(new Error(`getActiveTab: ${msg}`)); }
    )
#endif
#ifdef CHROME
    chrome.tabs.query({ currentWindow: true, active: true },
      function (tabs) {
        if (notLastError()) { resolve(tabs[0]) }
      });
#endif
  });
}

/* ---------------------------------------------------------------- */

function getSelectedFormat () {
  const formatItems = document.querySelectorAll('div.formats input');
  for (const item of formatItems) {
    if (item.checked) {
      return item.value;
    }
  }
}

function handleSubmit () {
  saveOptions({ format: getSelectedFormat() });
  getActiveTab().then(copyPageLink);
}

document.querySelector('form').addEventListener('submit', handleSubmit);
