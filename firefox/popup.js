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
**  displayed only when the condition in 'checkUrlProtocol' it met.
*/
function copyPageLink (tab) {
  browser.tabs.executeScript(null, { file: 'content.js' });
  window.close();
}

/* ---------------------------------------------------------------- */


function getActiveTab () {
  return new Promise (function (resolve, reject) {
    let promise = browser.tabs.query({ currentWindow: true, active: true });
    promise.then(
      tabs => { resolve(tabs[0]) },
      msg => { reject(new Error(`getActiveTab: ${msg}`)); }
    )
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
