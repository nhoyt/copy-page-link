/* background.js */

import { extensionName, linkFormats, getOptions } from './storage.js';
const debug = false;

function getCapitalizedFormat (options) {
  switch (options.format) {
    case 'markdown':  return 'Markdown';
    case 'mediawiki': return 'MediaWiki';
    case 'bbcode':    return 'BBCode';
    case 'html':      return 'HTML';
    case 'latex':     return 'LaTeX';
    case 'xml':       return 'XML';
  }
}

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
    case 'markdown':
      return `[${name}](${data.href})`;

    case 'html':
      return `<a href="${data.href}">${name}</a>`;

    case 'latex':
      return `\\\\href{${data.href}}{${name}}`;

    case 'mediawiki':
      return `[${data.href} ${name}]`;

    case 'bbcode':
      return `[url=${data.href}]${name}[/url]`

    case 'xml':
      return `      <${options.link} ${options.href}="${data.href}">\\n` +
             `        <${options.name}>${name}</${options.name}>\\n` +
             `      </${options.link}>\\n`;

    default:
      return 'Error: Unknown format option';
  }
}

/*
**  processLinkData: Called by the content script or copyPageLink directly,
**  depending on protocol of page link. First gets the extension options and
**  calls copyToClipboard. If successful, calls the notifySuccess function.
*/
function processLinkData (data) {

  function copyToClipboard (options) {
    let str = getFormattedLink(data, options);
    if (debug) console.log(str);
#ifdef FIREFOX
    return new Promise (function (resolve, reject) {
      let promise = navigator.clipboard.writeText(str);
      promise.then(
        () => { resolve(options); },
        msg => { reject(new Error(`copyToClipboard: ${msg}`)); }
      );
    });
#endif
#ifdef CHROME
    let listener = function (event) {
      event.clipboardData.setData('text/plain', str);
      event.preventDefault();
    };
    document.addEventListener('copy', listener);
    document.execCommand('copy', false, null);
    document.removeEventListener('copy', listener);
#endif
  }

  function notifySuccess (options) {
    const format = linkFormats.get(options.format);
    console.log(`Copied page link using ${format} format!`);
  }

#ifdef FIREFOX
  getOptions().then(copyToClipboard).then(notifySuccess).catch(onError);
#endif
#ifdef CHROME
  getOptions().then(function (options) {
    copyToClipboard(options);
    if (notLastError()) {
      notifySuccess(options);
      notLastError();
    }
  });
#endif
}

// Generic error handler
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

// Listen for messages from other scripts

function messageHandler (data, sender) {
  if (data.id === 'content') { processLinkData(data); }
}

#ifdef FIREFOX
browser.runtime.onMessage.addListener(messageHandler);
#endif
#ifdef CHROME
chrome.runtime.onMessage.addListener(messageHandler);
#endif
