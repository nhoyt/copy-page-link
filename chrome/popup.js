/* popup.js */

import { getOptions, saveOptions } from './storage.js';

function initForm (options) {
  const formatButtons = document.querySelectorAll('div.formats input');
  for (const input of formatButtons) {
    if (input.value === options.format) {
      input.checked = true;
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
  chrome.tabs.executeScript(null, { file: 'content.js' });
  window.close();
}

/* ---------------------------------------------------------------- */

// Redefine console for Chrome extension
var console = chrome.extension.getBackgroundPage().console;

function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    console.log(chrome.runtime.lastError.message);
    return false;
  }
}

function getActiveTab () {
  return new Promise (function (resolve, reject) {
    chrome.tabs.query({ currentWindow: true, active: true },
      function (tabs) {
        if (notLastError()) { resolve(tabs[0]) }
      });
  });
}

/* ---------------------------------------------------------------- */

function getSelectedFormat () {
  const formatButtons = document.querySelectorAll('div.formats input');
  for (const input of formatButtons) {
    if (input.checked) {
      return input.value;
    }
  }
}

function handleSubmit () {
  saveOptions({ format: getSelectedFormat() });
  getActiveTab().then(copyPageLink);
}

document.querySelector('form').addEventListener('submit', handleSubmit);
