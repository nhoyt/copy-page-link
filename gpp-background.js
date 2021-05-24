/* background.js */

import { extensionName, getOptions } from './storage.js';
const debug = true;

// Initialize notification icon and button tooltip
const iconFilename = 'images/logo-48.png';
#ifdef FIREFOX
const iconUrl = browser.extension.getURL(iconFilename);
#endif
#ifdef CHROME
const iconUrl = chrome.extension.getURL(iconFilename);
#endif
getOptions().then(setTooltip);

/*
**  setTooltip: Set the extension button tooltip to show the
**  extension name and the currently selected format option.
*/
function setTooltip (options) {
  let format = getCapitalizedFormat(options);
#ifdef FIREFOX
  browser.browserAction.setTitle({ title: `${extensionName}: ${format}` });
#endif
#ifdef CHROME
  chrome.browserAction.setTitle({ title: `${extensionName}: ${format}` });
#endif
}

function getCapitalizedFormat (options) {
  switch (options.format) {
    case 'markdown': return 'Markdown';
    case 'html':     return 'HTML';
    case 'latex':    return 'LaTeX';
    case 'wiki':     return 'Wiki';
    case 'bbcode':   return 'BBCode';
    case 'xml':      return 'XML';
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

    case 'wiki':
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
    let format = getCapitalizedFormat(options);
    let message = `${format}-formatted link copied to clipboard.`;
    let notificationOptions = {
      type: 'basic',
      iconUrl: iconUrl,
      title: extensionName,
      message: message
    };
#ifdef FIREFOX
    return new Promise (function (resolve, reject) {
      let promise = browser.notifications.create(notificationOptions);
      promise.catch(
        msg => { reject(new Error(`notifySuccess: ${msg}`)); }
      );
    });
#endif
#ifdef CHROME
    chrome.notifications.create(notificationOptions);
#endif
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

/*
**  copyPageLink: The handler for the browserAction.onClicked event and thus
**  the main entry point to the extension.
*/
function copyPageLink (tab) {
  // Security policy only allows us to inject the content script that
  // accesses title and selection for pages loaded with http or https.
  function checkUrlProtocol (tab) {
    return (tab.url.indexOf('http:') === 0 || tab.url.indexOf('https:') === 0);
  }

  if (checkUrlProtocol(tab)) {
#ifdef FIREFOX
    browser.tabs.executeScript(null, { file: 'content.js' });
#endif
#ifdef CHROME
    chrome.tabs.executeScript(null, { file: 'content.js' });
#endif
  }
  else {
    processLinkData({ href: tab.url, title: '', selection: '' });
  }
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
  if (data.id === 'tooltip') { setTooltip(data.options); }
}

#ifdef FIREFOX
browser.runtime.onMessage.addListener(messageHandler);
#endif
#ifdef CHROME
chrome.runtime.onMessage.addListener(messageHandler);
#endif

// Listen for toolbar button activation

#ifdef FIREFOX
browser.browserAction.onClicked.addListener(copyPageLink);
#endif
#ifdef CHROME
chrome.browserAction.onClicked.addListener(copyPageLink);
#endif
