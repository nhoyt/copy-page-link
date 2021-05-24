/* storage.js */

export const extensionName = 'Copy Page Link';

const iconFilename = 'images/logo-48.png';
export const iconUrl = chrome.extension.getURL(iconFilename);

export const defaultOptions = {
  format: 'markdown',
  link:   'site',
  href:   'href',
  name:   'name'
};

/*
** getOptions
*/
export function getOptions () {
  return new Promise (function (resolve, reject) {
    chrome.storage.sync.get(function (options) {
      if (notLastError()) { resolve(options) }
    });
  });
}

/*
** saveOptions
*/
export function saveOptions (options) {
  return new Promise (function (resolve, reject) {
    chrome.storage.sync.set(options, function () {
      if (notLastError()) { resolve() }
    });
  });
}

/*
**  initStorage: Called each time script is run
*/
function initStorage (options) {
  if (Object.entries(options).length === 0) {
    saveOptions(defaultOptions);
  }
}

getOptions().then(initStorage);

/*
**  clearStorage: Used for testing
*/
export function clearStorage () {
  chrome.storage.sync.clear();
}

/*
**  Generic error handler
*/
function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    console.log(chrome.runtime.lastError.message);
    return false;
  }
}
