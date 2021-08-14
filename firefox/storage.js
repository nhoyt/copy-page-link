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
  browser.storage.sync.clear();
}

