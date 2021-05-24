/* options.js */

import {
  extensionName,
  defaultOptions,
  getOptions,
  saveOptions
} from './storage.js';

var platformInfo;
const status = document.getElementById('status');
const debug = false;

// Initialize variables
#ifdef FIREFOX
browser.runtime.getPlatformInfo()
.then(info => { platformInfo = info; }, onError);
#endif
#ifdef CHROME
chrome.runtime.getPlatformInfo(info => { platformInfo = info; });
#endif

#ifdef FIREFOX
// Generic error handler
function onError (error) {
  console.log(`${extensionName}: ${error}`);
}
#endif
#ifdef CHROME
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
#endif

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
#ifdef FIREFOX
  browser.runtime.sendMessage({
    id: 'tooltip',
    options: options
  });
#endif
#ifdef CHROME
  chrome.runtime.sendMessage({
    id: 'tooltip',
    options: options
  });
#endif
}

/*
**  saveFormOptions: Save user options in storage.sync and display message
*/
function saveFormOptions(e) {
  e.preventDefault();

  const formats = document.getElementById('formats');
  const inputs = formats.getElementsByTagName('input');
  let selectedFormat = null;

  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].checked) {
      selectedFormat = inputs[i].value;
      break;
    }
  }

  if (selectedFormat) {
    const options = {
      format: selectedFormat,
      link: document.getElementById('link').value,
      href: document.getElementById('href').value,
      name: document.getElementById('name').value
    };

    if (debug) logOptions('saveFormOptions', 'options', options)
    saveOptions(options).then(notifySaved);
    setTooltip(options);
  }
}

/*
**  updateOptionsForm: Update HTML form values based on user options
*/
function updateOptionsForm() {

  function updateForm (options) {
    if (debug) logOptions('updateForm', 'options', options);;

    // Set the form element states and values
    document.getElementById(options.format).checked = true;
    document.getElementById('link').value = options.link;
    document.getElementById('href').value = options.href;
    document.getElementById('name').value = options.name;

    // Update button tooltip
    setTooltip(options);
  }

  getOptions().then(updateForm);
}

/*
**  restoreDefaults: Restore default values for all options in storage.sync
*/
function restoreDefaults (e) {
  e.preventDefault();

  if (debug) logOptions('restoreDefaults', 'defaultOptions', defaultOptions);

  // Save defaultOptions
  saveOptions(defaultOptions).then(notifyRestored);

  // Update the UI
  setTooltip(defaultOptions);
  updateOptionsForm();
}

function logOptions (context, objName, obj) {
  let output = [];
  for (const prop in obj) {
    output.push(`${prop}: '${obj[prop]}'`);
  }
  console.log(`${context}: ${objName}: ${output.join(', ')}`);
}

// Add event listeners for saving and restoring options

document.addEventListener('DOMContentLoaded', updateOptionsForm);
document.querySelector('form').addEventListener('submit', saveFormOptions);
document.querySelector('form button#restore').addEventListener('click', restoreDefaults);
