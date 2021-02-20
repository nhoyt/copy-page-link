/*
*   background.js
*/
const debug = false;
const defaultFormat = 'markdown';
const extensionName = 'Copy Page Link';

// Generic error handler for API methods that return Promise
function onError (error) {
  console.log(`Error: ${error}`);
}

(function initExtension() {
  browser.storage.sync.get()
  .then(setTooltip, onError);
})();

/* -------------------------------------------------------- */

function setTooltip (options) {
  let format = getCapitalizedFormat(options);
  browser.browserAction.setTitle({ title: `${extensionName}: ${format}` });
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
    return new Promise (function (resolve, reject) {
      let str = getFormattedLink(data, options);
      navigator.clipboard.writeText(str);
      resolve(options);
      reject(new Error('copyToClipboard'));
    });
  }

  function notifySuccess (options) {
    setTooltip(options);
    let format = getCapitalizedFormat(options);
    let message = `${format}-formatted link copied to clipboard.`;

    browser.notifications.create({
      "type": "basic",
      "title": "Copy Page Link",
      "message": message
    });
  }

  // Get the options data saved in browser.storage
  browser.storage.sync.get()
  .then(copyToClipboard)
  .then(notifySuccess)
  .catch(onError);
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
    browser.tabs.executeScript(null, { file: 'content.js' });
  }
  else {
    processLinkData({ href: tab.url, title: '', selection: '' });
  }
}

/* ---------------------------------------------------------------- */

// Listen for messages from the content script

browser.runtime.onMessage.addListener(
  function (request, sender) {
    processLinkData(request);
  }
);

// Listen for toolbar button activation

browser.browserAction.onClicked.addListener(copyPageLink);
