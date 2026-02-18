/* storage.js */

const browser = chrome || browser;

export const extensionName = 'Copy Page Link';

const formatsArray = [
  ['html',      'HTML'],
  ['latex',     'LaTeX'],
  ['markdown',  'Markdown'],
  ['mediawiki', 'MediaWiki'],
  ['rawurl',    'Raw URL'],
  ['textile',   'Textile'],
  ['xml',       'XML']
];

export const linkFormats = new Map(formatsArray);

export const defaultDisplaySettings = {
  html:       true,
  latex:      false,
  markdown:   true,
  mediawiki:  false,
  rawurl:     true,
  textile:    false,
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
export async function getOptions () {
  try {
    let options = await browser.storage.sync.get();
    if (isComplete(options)) {
      return options;
    }
    else {
      const optionsWithDefaults = addDefaultValues(options);
      saveOptions(optionsWithDefaults);
      return optionsWithDefaults;
    }
  }
  catch (error) {
    return new Error(`getOptions: ${error.message}`);
  }
}

/*
**  saveOptions
*/
export async function saveOptions (options) {
  try {
    await browser.storage.sync.set(options);
  }
  catch (error) {
    return new Error(`saveOptions: ${error.message}`);
  }
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
  browser.storage.sync.clear();
}
