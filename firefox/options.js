/*
*   options.js
*/
const debug = false;
const defaultFormat = 'markdown';
var message;

// Generic error handler for API methods that return Promise
function onError (error) {
  console.log(`Error: ${error}`);
}

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

browser.runtime.getPlatformInfo().then(setMessage, onError);

function setTooltip (options) {
  function callBackgroundPageFn (page) {
    page.setTooltip(options);
  }
    browser.runtime.getBackgroundPage().then(callBackgroundPageFn, onError);
}

/* -------------------------------------------------------- */
/*   Functions for saving and restoring user options        */
/* -------------------------------------------------------- */

// Save user options in browser.storage and display message

function saveOptions(e) {
  e.preventDefault();

  // For use during development
  if (false) {
    browser.storage.sync.clear();
    return;
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

  function notifyUser () {
    let status = document.getElementById('status');
    status.textContent = message;

    setTimeout(function () {
      status.textContent = '';
    }, 750);
    if (debug) console.log(message);
  }

  if (selectedFormat) {
    let options = {
      format: selectedFormat,
      link: document.getElementById('link').value,
      href: document.getElementById('href').value,
      name: document.getElementById('name').value
    };
    setTooltip(options);

    browser.storage.sync.set(options).then(notifyUser, onError);
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

  browser.storage.sync.get().then(setPreferences, onError);
}

// Add event listeners for saving and restoring options

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
