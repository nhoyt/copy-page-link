/* options.js */

import {
  extensionName,
  defaultDisplaySettings,
  defaultOptions,
  getOptions,
  saveOptions,
  logOptions
} from './storage.js';

const debug = true;

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

function notifyOverride () {
  displayMessage('No formats enabled! Using default menu settings…');
}

/*
**  saveFormOptions: Save user options in storage.sync and display message
*/
function saveFormOptions(e) {
  e.preventDefault();

  const displaySettings = {
    html:       document.getElementById('html').checked,
    latex:      document.getElementById('latex').checked,
    markdown:   document.getElementById('markdown').checked,
    mediawiki:  document.getElementById('mediawiki').checked,
    xml:        document.getElementById('xml').checked
  }

  let oneOrMoreChecked = false;
  for (const prop in displaySettings) {
    oneOrMoreChecked = oneOrMoreChecked || displaySettings[prop];
  }

  const options = {
    display: oneOrMoreChecked ? displaySettings : defaultDisplaySettings,
    link:       document.getElementById('link').value,
    href:       document.getElementById('href').value,
    name:       document.getElementById('name').value
  }

  if (oneOrMoreChecked) {
    saveOptions(options).then(notifySaved);
  }
  else {
    saveOptions(options).then(notifyOverride);
    updateOptionsForm();
  }

  if (debug) logOptions('saveFormOptions', 'options', options);
}

/*
**  updateOptionsForm: Update HTML form values based on user options
*/
function updateOptionsForm() {

  function updateForm (options) {
    if (debug) logOptions('updateForm', 'options', options);;

    // Set the form element states and values
    const displaySettings = options.display;
    for (const prop in displaySettings) {
      document.getElementById(prop).checked = displaySettings[prop];
    }
    document.getElementById('link').value = options.link;
    document.getElementById('href').value = options.href;
    document.getElementById('name').value = options.name;
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
  updateOptionsForm();
}

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

// Add event listeners for saving and restoring options

document.addEventListener('DOMContentLoaded', updateOptionsForm);
document.querySelector('form').addEventListener('submit', saveFormOptions);
document.querySelector('form button#restore').addEventListener('click', restoreDefaults);
