/* options.js */

import {
  extensionName,
  defaultDisplaySettings,
  defaultOptions,
  getOptions,
  saveOptions,
  logOptions
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
    textile:    document.getElementById('textile').checked,
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

    // Popup menu settings
    const displaySettings = options.display;
    for (const prop in displaySettings) {
      document.getElementById(prop).checked = displaySettings[prop];
    }

    // XML format settings
    document.getElementById('link').value = options.link;
    document.getElementById('href').value = options.href;
    document.getElementById('name').value = options.name;
  }

  getOptions().then(updateForm);
}


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
