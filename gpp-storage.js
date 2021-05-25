/* storage.js */

export const extensionName = 'Copy Page Link';

export const defaultOptions = {
  format: 'markdown',
  link:   'site',
  href:   'href',
  name:   'name'
};

/*
**  getOptions
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
**  saveOptions
*/
export function saveOptions (options) {
  return new Promise (function (resolve, reject) {
#ifdef FIREFOX
    let promise = browser.storage.sync.set(options);
    promise.then(
      () => { resolve() },
      message => { reject(new Error(`saveOptions: ${message}`)) }
    );
#endif
#ifdef CHROME
    chrome.storage.sync.set(options, function () {
      if (notLastError()) { resolve() }
    });
#endif
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
#ifdef FIREFOX
  browser.storage.sync.clear();
#endif
#ifdef CHROME
  chrome.storage.sync.clear();
#endif
}

#ifdef CHROME
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
#endif
