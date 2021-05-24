/* options.js */

import {
  extensionName,
  defaultOptions,
  getOptions,
  saveOptions
} from './storage.js';

const debug = false;

// Functions for displaying messages

function displayMessage (message) {
  const status = document.getElementById('status');
  status.textContent = message;

  setTimeout(function () { status.textContent = ''; }, 1500);
  if (debug) console.log(message);
}

function notifySaved () {
  displayMessage('Options saved!');
}

function notifyRestored () {
  displayMessage('Default values for options restored!');
}

// Utility functions

function setTooltip (options) {
  chrome.runtime.sendMessage({
    id: 'tooltip',
    options: options
  });
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

// Add event listeners for saving and restoring options

document.addEventListener('DOMContentLoaded', updateOptionsForm);
document.querySelector('form').addEventListener('submit', saveFormOptions);
document.querySelector('form button#restore').addEventListener('click', restoreDefaults);
