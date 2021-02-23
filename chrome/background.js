/*
*   background.js
*/
const debug = false;
const defaultFormat = 'markdown';
const extensionName = 'Copy Page Link';
const iconFilename = 'images/logo-48.png';

const iconUrl = chrome.extension.getURL(iconFilename);

// If lastError is undefined, return true. Otherwise, log the error
// message to the console and return false.
function notLastError () {
  if (!chrome.runtime.lastError) { return true; }
  else {
    console.log(chrome.runtime.lastError.message);
    return false;
  }
}

(function initExtension() {
  chrome.storage.sync.get(function (options) {
    if (notLastError()) {
      setTooltip(options);
    }
  });
})();

/* -------------------------------------------------------- */

function setTooltip (options) {
  let format = getCapitalizedFormat(options);
  chrome.browserAction.setTitle({ title: `${extensionName}: ${format}` });
}

function getCapitalizedFormat (options) {
  switch (options.format) {
    case 'markdown':
      return 'Markdown';
    case 'html':
      return 'HTML';
    case 'latex':
      return 'LaTeX';
    case 'xml':
      return 'XML';
    default:
      return 'Markdown';
  }
}

/* -------------------------------------------------------- */

//  getFormattedLink: The main function for extracting and processing
//  the data used for creating the formatted link markup.

function getFormattedLink (data, options) {
  // Truncate selection string if length exceeds maximum
  const maxLength = 120;
  if (data.selection && data.selection.length > maxLength) {
    data.selection = data.selection.substring(0, maxLength) + '…';
  }

  // Construct and return the link markup based on format option
  let name = data.selection ? data.selection : data.title;
  let format = options.format || defaultFormat;

  switch (format) {
    case 'markdown':
      return `[${name}](${data.href})`;

    case 'html':
      return `<a href="${data.href}">${name}</a>`;

    case 'latex':
      return `\\href{${data.href}}{${name}}`;

    case 'xml':
      return `      <${options.link} ${options.href}="${data.href}">\n` +
             `        <${options.name}>${name}</${options.name}>\n` +
             `      </${options.link}>\n`;

    default:
      return 'Error: Unknown format option';
  }
}

/* ---------------------------------------------------------------- */

//  processLinkData: Called by the content script or copyPageLink directly,
//  depending on protocol of page link. First gets the extension options and
//  calls copyToClipboard. If successful, calls the notifySuccess function.

function processLinkData (data) {

  function copyToClipboard (options) {
    let str = getFormattedLink(data, options);
    let listener = function (event) {
      event.clipboardData.setData('text/plain', str);
      event.preventDefault();
    };
    document.addEventListener('copy', listener);
    document.execCommand('copy', false, null);
    document.removeEventListener('copy', listener);
  }

  function notifySuccess (options) {
    let format = getCapitalizedFormat(options);
    let message = `${format}-formatted link copied to clipboard.`;
    let notificationOptions = {
      type: 'basic',
      iconUrl: iconUrl,
      title: 'Copy Page Link',
      message: message
    };
    chrome.notifications.create(notificationOptions);
  }

  chrome.storage.sync.get(function (options) {
    if (notLastError()) {
      copyToClipboard(options);
      if (notLastError()) {
        notifySuccess(options);
        notLastError();
      }
    }
  });
}

/* ---------------------------------------------------------------- */

//  copyPageLink: The handler for the browserAction.onClicked event and thus
//  the main entry point to the extension.

function copyPageLink (tab) {
  // Security policy only allows us to inject the content script that
  // accesses title and selection for pages loaded with http or https.
  function checkUrlProtocol (tab) {
    return (tab.url.indexOf('http:') === 0 || tab.url.indexOf('https:') === 0);
  }

  if (checkUrlProtocol(tab)) {
    chrome.tabs.executeScript(null, { file: 'content.js' });
  }
  else {
    processLinkData({ href: tab.url, title: '', selection: '' });
  }
}

/* ---------------------------------------------------------------- */

// Listen for messages from the content script

chrome.runtime.onMessage.addListener(
  function (request, sender) {
    processLinkData(request);
  }
);

// Listen for toolbar button activation

chrome.browserAction.onClicked.addListener(copyPageLink);
