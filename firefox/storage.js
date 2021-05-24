/* storage.js */

export const defaultFormat = 'markdown';
export const extensionName = 'Copy Page Link';

const iconFilename = 'images/logo-48.png';
export const iconUrl = browser.extension.getURL(iconFilename);

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
    let promise = browser.storage.sync.get();
    promise.then(
      options => { resolve(options) },
      message => { reject(new Error(`getOptions: ${message}`)) }
    );
  });
}

/*
** saveOptions
*/
export function saveOptions (options) {
  return new Promise (function (resolve, reject) {
    let promise = browser.storage.set(options);
    promise.then(
      () => { resolve() },
      message => { reject(new Error(`getOptions: ${message}`)) }
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
**  Generic error handler
*/
function onError (error) {
  console.log(`${extensionName}: ${error}`);
}
