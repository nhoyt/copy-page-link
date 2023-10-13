/* storage.js */

export const extensionName = 'Copy Page Link';

const formatsArray = [
  ['html',      'HTML'],
  ['latex',     'LaTeX'],
  ['markdown',  'Markdown'],
  ['mediawiki', 'MediaWiki'],
  ['textile',   'Textile'],
  ['xml',       'XML']
];

export const linkFormats = new Map(formatsArray);

export const defaultDisplaySettings = {
  html:       true,
  latex:      true,
  markdown:   true,
  mediawiki:  true,
  textile:    true,
  xml:        false
};

export const defaultOptions = {
  display:    defaultDisplaySettings,
  format:     'html',
  link:       'site',
  href:       'href',
  name:       'name'
};

function hasAllProperties (refObj, srcObj) {
  for (const key of Object.keys(refObj)) {
    if (!srcObj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

function isComplete (obj) {
  const numOptions = Object.keys(defaultOptions).length;
  if (Object.keys(obj).length !== numOptions) {
    return false;
  }
  return hasAllProperties(defaultOptions, obj);
}

function addDefaultValues (options) {
  const copy = Object.assign({}, defaultOptions);
  for (let [key, value] of Object.entries(options)) {
    if (copy.hasOwnProperty(key)) {
      copy[key] = value;
    }
  }
  return copy;
}

/*
**  getOptions
*/
export function getOptions () {
  return new Promise (function (resolve, reject) {
    chrome.storage.sync.get(function (options) {
      if (notLastError()) {
        if (isComplete(options)) {
          resolve(options);
        }
        else {
          const optionsWithDefaults = addDefaultValues(options);
          saveOptions(optionsWithDefaults);
          resolve(optionsWithDefaults);
        }
      }
    });
  });
}

/*
**  saveOptions
*/
export function saveOptions (options) {
  return new Promise (function (resolve, reject) {
    chrome.storage.sync.set(options, function () {
      if (notLastError()) { resolve() }
    });
  });
}

/*
**  logOptions
*/
export function logOptions (context, objName, obj) {
  let output = [];
  for (const prop in obj) {
    if (typeof obj[prop] === 'object') {
      let inner = obj[prop];
      for (const p in inner) {
        output.push(`${p}: ${inner[p]}`);
      }
    }
    else {
      output.push(`${prop}: '${obj[prop]}'`);
    }
  }
  console.log(`${context} > ${objName} > ${output.join(', ')}`);
}

/*
**  clearStorage: Used for testing
*/
export function clearStorage () {
  chrome.storage.sync.clear();
}

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
