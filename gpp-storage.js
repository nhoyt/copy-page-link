/* storage.js */

export const defaultFormat = 'markdown';
export const extensionName = 'Copy Page Link';

const iconFilename = 'images/logo-48.png';
#ifdef FIREFOX
export const iconUrl = browser.extension.getURL(iconFilename);
#endif
#ifdef CHROME
export const iconUrl = chrome.extension.getURL(iconFilename);
#endif

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
#ifdef FIREFOX
    let promise = browser.storage.sync.get();
    promise.then(
      options => { resolve(options) },
      message => { reject(new Error(`getOptions: ${message}`)) }
    );
#endif
#ifdef CHROME
    chrome.storage.sync.get(function (options) {
      if (notLastError()) { resolve(options) }
    });
#endif
  });
}

/*
** saveOptions
*/
export function saveOptions (options) {
  return new Promise (function (resolve, reject) {
#ifdef FIREFOX
    let promise = browser.storage.set(options);
    promise.then(
      () => { resolve ()},
      message => { reject(new Error(`getOptions: ${message}`)) }
    );
#endif
#ifdef CHROME
    chrome.storage.sync.set(options, function () {
      if (notLastError()) { resolve () }
    });
#endif
  });
}

/*
**  initStorage
*/
function initStorage (options) {
  if (Object.entries(options).length === 0) {
    saveOptions(defaultOptions);
  }
}

#ifdef FIREFOX
browser.storage.sync.get().then(initStorage, onError);
#endif
#ifdef CHROME
chrome.storage.sync.get(function (options) {
  if (notLastError()) { initStorage(options); }
});
#endif

/*
**  Generic error handler
*/
#ifdef FIREFOX
function onError (error) {
  console.log(`${extensionName}: ${error}`);
}
#endif
#ifdef CHROME
function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    console.log(chrome.runtime.lastError.message);
    return false;
  }
}
#endif
