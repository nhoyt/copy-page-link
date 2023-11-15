/* popup.js */

import { linkFormats, getOptions, saveOptions } from './storage.js';

/*
**  Copy Page Link can only process web pages with an 'http' or 'https'
**  protocol. If the page URL does not have one of these protocols, the
**  checkUrlProtocol function displays an error message.
**
**  Otherwise, it calls initForm with the currently set options, which
**  include the link formats to be displayed as specified in Preferences,
**  and with the most recently used link format preselected and focused.
*/
function initForm (options) {
  const container = document.querySelector('div.formats');
  const displaySettings = options.display;
  let hasSelection = false;

  function getFormatDiv (prop, count) {
    const div = document.createElement('div');
    const id = `rb${count}`;

    div.innerHTML = `
      <input type="radio" name="format" id="${id}" value="${prop}">
      <label for="${id}">${linkFormats.get(prop)}</label>`;

    return div;
  }

  function selectItem (item) {
    item.checked = true;
    item.focus();
  }

  let count = 0;
  for (const prop in displaySettings) {
    if (displaySettings[prop]) {
      const item = getFormatDiv(prop, ++count);
      container.appendChild(item);
    }
  }

  const formatItems = document.querySelectorAll('div.formats input');
  for (const item of formatItems) {
    if (item.value === options.format) {
      selectItem(item);
      hasSelection = true;
    }
  }

  if (formatItems.length && !hasSelection) {
    selectItem(formatItems[0]);
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
**  Helper functions
*/

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

/*
**  copyPageLink: Executes the content script, which extracts data from
**  the active tab web page and then sends it to the background script,
**  which in turn formats the link markup and copies it to the clipboard.
*/
function copyPageLink () {
  browser.tabs.executeScript(null, { file: 'content.js' });
  window.close();
}

/*
**  When the user submits the Copy Page Link form, 'handleSubmit' first
**  saves the user-selected format so that it can be retrieved for use
**  by the background script. It then calls the 'copyPageLink' function.
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
  copyPageLink();
}

function openOptions () {
  browser.runtime.openOptionsPage().then(window.close());

}

document.querySelector('form').addEventListener('submit', handleSubmit);
document.querySelector('button#options').addEventListener('click', openOptions);
