/*
*   options.js
*/
const debug = false;
const defaultFormat = 'markdown';
var message;

#ifdef FIREFOX
// Generic error handler for API methods that return Promise
function onError (error) {
  console.log(`Error: ${error}`);
}
#endif
#ifdef CHROME
// Redefine console for Chrome extension logging
var console = chrome.extension.getBackgroundPage().console;

// If lastError is undefined, return true. Otherwise, log the error
// message to the console and return false.
function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    console.log(chrome.runtime.lastError.message);
    return false;
  }
}
#endif

// Set the message text to be displayed when options are saved

function setMessage (info) {
  switch (info.os) {
    case 'mac':
      message = 'Preferences saved!';
      break;
    default:
      message = 'Options saved!';
      break;
  }
}

#ifdef FIREFOX
browser.runtime.getPlatformInfo().then(setMessage, onError);
#endif
#ifdef CHROME
chrome.runtime.getPlatformInfo(setMessage);
#endif

function setTooltip (options) {
  function callBackgroundPageFn (page) {
    page.setTooltip(options);
  }
#ifdef FIREFOX
  browser.runtime.getBackgroundPage().then(callBackgroundPageFn, onError);
#endif
#ifdef CHROME
   chrome.runtime.getBackgroundPage(callBackgroundPageFn);
#endif
}

/* -------------------------------------------------------- */
/*   Functions for saving and restoring user options        */
/* -------------------------------------------------------- */

// Save user options in browser.storage and display message

function saveOptions(e) {
  e.preventDefault();

  // For use during development
  if (false) {
#ifdef FIREFOX
    browser.storage.sync.clear();
#endif
#ifdef CHROME
    chrome.storage.sync.clear();
#endif
    return;
  }

  function notifyUser () {
    let status = document.getElementById('status');
    status.textContent = message;

    setTimeout(function () {
      status.textContent = '';
    }, 750);
    if (debug) console.log(message);
  }

  let formats = document.getElementById('formats');
  let inputs = formats.getElementsByTagName('input');
  let selectedFormat = null;

  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].checked) {
      selectedFormat = inputs[i].value;
      break;
    }
  }

  if (selectedFormat) {
    let options = {
      format: selectedFormat,
      link: document.getElementById('link').value,
      href: document.getElementById('href').value,
      name: document.getElementById('name').value
    };
    setTooltip(options);

#ifdef FIREFOX
    browser.storage.sync.set(options).then(notifyUser, onError);
#endif
#ifdef CHROME
    chrome.storage.sync.set(options, function () {
      if (notLastError()) notifyUser();
    });
#endif
  }
}

// Restore HTML form values based on user options saved in browser.storage

function restoreOptions() {

  function setPreferences (options) {
    document.getElementById(options.format || defaultFormat).checked = true;
    document.getElementById('link').value = options.link || 'site';
    document.getElementById('href').value = options.href || 'href';
    document.getElementById('name').value = options.name || 'name';

    if (debug) console.log(options);
    setTooltip(options);
  }

#ifdef FIREFOX
  browser.storage.sync.get().then(setPreferences, onError);
#endif
#ifdef CHROME
  chrome.storage.sync.get(function (options) {
    if (notLastError()) setPreferences(options);
  });
#endif
}

// Add event listeners for saving and restoring options

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
