/* options.js */

import {
  defaultFormat,
  extensionName,
  defaultOptions,
  getOptions,
  saveOptions
} from './storage.js';

var platformInfo;
const status = document.getElementById('status');
const debug = true;

// Initialize variables
chrome.runtime.getPlatformInfo(info => { platformInfo = info; });

// Redefine console for Chrome extension
var console = chrome.extension.getBackgroundPage().console;

// Generic error handler
function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    console.log(chrome.runtime.lastError.message);
    return false;
  }
}

// Functions for displaying messages

function displayMessage (message) {
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

function setTooltip (options) {
  chrome.runtime.sendMessage({
    id: 'tooltip',
    options: options
  });
}

/* -------------------------------------------------------- */
/*   Functions for saving and restoring user options        */
/* -------------------------------------------------------- */

// Save user options in storage.sync and display message

function saveFormOptions(e) {
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

    saveOptions(options).then(notifySaved);
    setTooltip(options);
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

  getOptions().then(updateForm);
}

// Restore the default values for all options in storage.sync

function restoreDefaults (e) {
  e.preventDefault();

  // Save defaultOptions
  saveOptions(defaultOptions).then(notifyRestored);

  // Update the UI
  setTooltip(defaultOptions);
  updateOptionsForm();
}

// Add event listeners for saving and restoring options

document.addEventListener('DOMContentLoaded', updateOptionsForm);
document.querySelector('form').addEventListener('submit', saveFormOptions);
document.querySelector('form button#restore').addEventListener('click', restoreDefaults);
