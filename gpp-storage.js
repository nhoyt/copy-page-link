/* storage.js */

export const extensionName = 'Copy Page Link';

const formatsArray = [
  ['html',      'HTML'],
  ['latex',     'LaTeX'],
  ['markdown',  'Markdown'],
  ['mediawiki', 'MediaWiki'],
  ['xml',       'XML']
];

export const linkFormats = new Map(formatsArray);

export const defaultOptions = {
  format:     'markdown',
  link:       'site',
  href:       'href',
  name:       'name'
};

/*
**  getOptions
*/
export function getOptions () {
  return new Promise (function (resolve, reject) {
#ifdef FIREFOX
    let promise = browser.storage.sync.get();
    promise.then(
      options => {
        if (Object.entries(options).length > 0) {
          resolve(options);
        }
        else {
          saveOptions(defaultOptions);
          resolve(defaultOptions);
        }
      },
      message => { reject(new Error(`getOptions: ${message}`)) }
    );
#endif
#ifdef CHROME
    chrome.storage.sync.get(function (options) {
      if (notLastError()) {
        if (Object.entries(options).length > 0) {
          resolve(options);
        }
        else {
          saveOptions(defaultOptions)
          resolve(defaultOptions);
        }
      }
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
**  logOptions
*/
export function logOptions (context, objName, obj) {
  let output = [];
  for (const prop in obj) {
    output.push(`${prop}: '${obj[prop]}'`);
  }
  console.log(`${context} > ${objName} > ${output.join(', ')}`);
}

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
