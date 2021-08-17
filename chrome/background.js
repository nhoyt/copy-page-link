/* background.js */

import { extensionName, linkFormats, getOptions } from './storage.js';
const debug = false;

/*
**  getFormattedLink: The main function for extracting and processing
**  the data used for creating the formatted link markup.
*/
function getFormattedLink (data, options) {
  // Truncate selection string if length exceeds maximum
  const maxLength = 120;
  if (data.selection && data.selection.length > maxLength) {
    data.selection = data.selection.substring(0, maxLength) + '…';
  }

  // Construct and return the link markup based on format option
  let name = data.selection ? data.selection : data.title;
  let format = options.format;

  switch (format) {
    case 'html':
      return `<a href="${data.href}">${name}</a>`;

    case 'latex':
      return `\\href{${data.href}}{${name}}`;

    case 'markdown':
      return `[${name}](${data.href})`;

    case 'mediawiki':
      return `[${data.href} ${name}]`;

    case 'xml':
      return `      <${options.link} ${options.href}="${data.href}">\n` +
             `        <${options.name}>${name}</${options.name}>\n` +
             `      </${options.link}>\n`;

    default:
      return 'Error: Unknown format option';
  }
}

/*
**  processLinkData: Called when this script (background) receives 'content'
**  message from the content script. It first gets the extension options and
**  then calls 'copyToClipboard'. If successful, it calls 'notifySuccess'.
*/
function processLinkData (data) {

  function copyToClipboard (options) {
    let str = getFormattedLink(data, options);
    if (debug) console.log(str);
    let listener = function (event) {
      event.clipboardData.setData('text/plain', str);
      event.preventDefault();
    };
    document.addEventListener('copy', listener);
    document.execCommand('copy', false, null);
    document.removeEventListener('copy', listener);
  }

  function notifySuccess (options) {
    const format = linkFormats.get(options.format);
    console.log(`Copied page link using ${format} format!`);
  }

  getOptions().then(function (options) {
    copyToClipboard(options);
    if (notLastError()) {
      notifySuccess(options);
      notLastError();
    }
  });
}

// Generic error handler
function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    console.log(chrome.runtime.lastError.message);
    return false;
  }
}

// Listen for message from content script

function messageHandler (data, sender) {
  if (data.id === 'content') { processLinkData(data); }
}

chrome.runtime.onMessage.addListener(messageHandler);
