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
    let promise = browser.storage.sync.get();
    promise.then(
      options => { resolve(options) },
      message => { reject(new Error(`getOptions: ${message}`)) }
    );
  });
}

/*
**  saveOptions
*/
export function saveOptions (options) {
  return new Promise (function (resolve, reject) {
    let promise = browser.storage.sync.set(options);
    promise.then(
      () => { resolve() },
      message => { reject(new Error(`saveOptions: ${message}`)) }
    );
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
  browser.storage.sync.clear();
}

/*
**  Generic error handler
*/
