/*
*   options.js
*/
const debug = false;
const defaultFormat = 'markdown';
var platformInfo;

// Generic error handler for API methods that return Promise
function onError (error) {
  console.log(`Error: ${error}`);
}

// Initialize platformInfo when script loads

browser.runtime.getPlatformInfo().then(info => { platformInfo = info; }, onError);

// Functions for displaying messages

function displayMessage (message) {
  let status = document.getElementById('status');
  status.textContent = message;

  setTimeout(function () { status.textContent = ''; }, 1500);
  if (debug) console.log(message);
}

function notifySaved () {
  let str = (platformInfo.os === 'mac') ? 'Preferences' : 'Options';
  displayMessage(`${str} saved!`);
}

function notifyRestored () {
  let str = (platformInfo.os === 'mac') ? 'preferences' : 'options';
  displayMessage(`Default values for ${str} restored!`);
}

// Utility functions

function clearOptions () {
  browser.storage.sync.clear();
}

function setTooltip (options) {
  function callBackgroundPageFn (page) {
    page.setTooltip(options);
  }
  browser.runtime.getBackgroundPage().then(callBackgroundPageFn, onError);
}

/* -------------------------------------------------------- */
/*   Functions for saving and restoring user options        */
/* -------------------------------------------------------- */

// Save user options in storage.sync and display message

function saveOptions(e) {
  e.preventDefault();

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

    browser.storage.sync.set(options).then(notifySaved, onError);
  }
}

// Update HTML form values based on user options saved in storage.sync

function updateOptionsForm() {

  function updateForm (options) {
    if (debug) console.log(options);

    // Set the form element states and values
    document.getElementById(options.format || defaultFormat).checked = true;
    document.getElementById('link').value = options.link || 'site';
    document.getElementById('href').value = options.href || 'href';
    document.getElementById('name').value = options.name || 'name';

    // Update button tooltip
    setTooltip(options);
  }

  browser.storage.sync.get().then(updateForm, onError);
}

// Restore the default values for all options in storage.sync

function restoreDefaults (e) {
  e.preventDefault();

  const defaultOptions = {
    format: defaultFormat,
    link:   'site',
    href:   'href',
    name:   'name'
  };

  // First, clear everything...
  clearOptions();

  // Save the default values...
  browser.storage.sync.set(defaultOptions).then(notifyRestored, onError);

  // Finally, update the UI...
  setTooltip(defaultOptions);
  updateOptionsForm();
}

// Add event listeners for saving and restoring options

document.addEventListener('DOMContentLoaded', updateOptionsForm);
document.querySelector('form').addEventListener('submit', saveOptions);
document.querySelector('form button#restore').addEventListener('click', restoreDefaults);
