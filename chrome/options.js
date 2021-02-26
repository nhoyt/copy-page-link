/*
*   options.js
*/
const debug = false;
var defaultFormat;
var extensionName;
var platformInfo;

function messageHandler (data, sender) {
  if (data.id === 'background') {
    [defaultFormat, extensionName] = data.values;
    if (debug) console.log(data);
  }
}

// Initialize variables
chrome.runtime.getPlatformInfo(info => { platformInfo = info; });
chrome.runtime.sendMessage({ id: 'options' });
chrome.runtime.onMessage.addListener(messageHandler);

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

    chrome.storage.sync.set(options, function () {
      if (notLastError()) { notifySaved(); }
    });
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

  chrome.storage.sync.get(function (options) {
    if (notLastError()) { updateForm(options); }
  });
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
  chrome.storage.sync.clear();

  // Save the default values...
  chrome.storage.sync.set(defaultOptions, function () {
    if (notLastError()) { notifyRestored(); }
  });

  // Finally, update the UI...
  setTooltip(defaultOptions);
  updateOptionsForm();
}

// Add event listeners for saving and restoring options

document.addEventListener('DOMContentLoaded', updateOptionsForm);
document.querySelector('form').addEventListener('submit', saveOptions);
document.querySelector('form button#restore').addEventListener('click', restoreDefaults);
