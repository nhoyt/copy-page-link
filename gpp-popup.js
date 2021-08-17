/* popup.js */

import { getOptions, saveOptions } from './storage.js';

/*
**  Copy Page Link can only process web pages with an 'http' or 'https'
**  protocol. If the page URL does not have one of these protocols,
**  'checkUrlProtocol' displays an error message. Otherwise, it displays
**  the Copy Page Link form, initialized with the most recently used link
**  format preselected and focused.
*/
function initForm (options) {
  const formatItems = document.querySelectorAll('div.formats input');
  for (const item of formatItems) {
    if (item.value === options.format) {
      item.checked = true;
      item.focus();
    }
  }
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
**  copyPageLink: Called from the 'handleSubmit' function. It executes the
**  content script, which extracts data from the active tab web page, and
**  then sends the data, via message, to the background script, which in
**  turn formats the page link markup and copies it to the clipboard.
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

/*
**  Helper functions
*/

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

/*
**  When the user submits the Copy Page Link form, 'handleSubmit' first
**  saves the user-selected format so that it can be retrieved for use
**  by the background script. It then calls the 'copyPageLink' function
**  with the active tab as its argument.
*/
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
