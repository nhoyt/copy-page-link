/* popup.js */

import { linkFormats, getOptions, saveOptions } from './storage.js';
const browser = chrome || browser;

/*
**  Helper functions
*/
async function getActiveTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await browser.tabs.query(queryOptions);
  return tab;
}

/* ---------------------------------------------------------------- */

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

  // Loop through displaySettings object (each property is a key/value pair
  // where key is a format name and value is a boolean indicating whether that
  // format should be displayed in the 'Formats' menu), adding format items to
  // the menu container as specified by user preferences.
  let count = 0;
  for (const prop in displaySettings) {
    if (displaySettings[prop]) {
      const item = getFormatDiv(prop, ++count);
      container.appendChild(item);
    }
  }

  // Last two steps of initialization:

  // 1. Loop through format items added to the menu container and if we find
  // one that corresponds to last-used format (options.format), select it...
  const formatItems = document.querySelectorAll('div.formats input');
  for (const item of formatItems) {
    if (item.value === options.format) {
      selectItem(item);
      hasSelection = true;
    }
  }

  // 2. Otherwise (nothing selected yet), select the first item in the menu.
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
**  copyPageLink: Executes the content script, which (1) extracts data from
**  the active tab web page; (2) sends that data to the background script,
**  which (3) formats the link markup and, finally (4) sends the result back
**  to the content script, which copies it to the clipboard.
*/
async function copyPageLink () {
  let activeTab = await getActiveTab();
  try {
    await browser.scripting.executeScript({
      target: { tabId: activeTab.id },
      files: [ 'content.js' ],
      injectImmediately: true
    });
  }
  catch (error) {
    console.log(`copyPageLink: ${error.message}`);
  }
}

/*
**  When the user submits the Copy Page Link form, the event handler first
**  saves the user-selected format so that it can be retrieved for use by the
**  background script. It then calls the 'copyPageLink' function.
*/
function getSelectedFormat () {
  const formatItems = document.querySelectorAll('div.formats input');
  for (const item of formatItems) {
    if (item.checked) {
      return item.value;
    }
  }
}

// When user submits popup form - main execution path
document.querySelector('form').addEventListener('submit',
  async () => {
    await saveOptions({ format: getSelectedFormat() });
    copyPageLink();
    window.close();
  });

// When user clicks options icon - open options page
document.querySelector('button#options').addEventListener('click',
  () => {
    browser.runtime.openOptionsPage().then(window.close());
  });
