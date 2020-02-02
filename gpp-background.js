/*
*   background.js
*/
const defaultFormat = 'markdown';
var options; // Initialized by startProcessing in popup.js

#ifdef FIREFOX
// Generic error handler for API methods that return Promise
function onError (error) {
  console.log(`Error: ${error}`);
}
#endif

/* -------------------------------------------------------- */
/*   Functions for extracting and processing link info      */
/* -------------------------------------------------------- */

function copyToClipboard (str) {
  let listener = function (event) {
    event.clipboardData.setData('text/plain', str);
    event.preventDefault();
  };
  document.addEventListener('copy', listener);
  document.execCommand('copy', false, null);
  document.removeEventListener('copy', listener);
}

function getFormattedLink (data) {
  let name = data.selection ? data.selection : data.title;
  let format = options.format || defaultFormat;

  switch (format) {
    case 'markdown':
      return `[${name}](${data.href})`;

    case 'html':
      return `<a href="${data.href}">${name}</a>`;

    case 'latex':
      return `\\\\href{${data.href}}{${name}}`;

    case 'xml':
      return `      <${options.link} ${options.href}="${data.href}">\\n` +
             `        <${options.name}>${name}</${options.name}>\\n` +
             `      </${options.link}>\\n`;

    default:
      return 'Error: Unknown format option';
  }
}

function processLinkData (data) {
  // Truncate selection string if length exceeds maximum
  const maxLength = 120;
  if (data.selection && data.selection.length > maxLength) {
    data.selection = data.selection.substring(0, maxLength) + '…';
  }
  copyToClipboard(getFormattedLink(data));
}

/* ---------------------------------------------------------------- */

// Because we've declared a popup for the extension, we need an entry point
// function we can call from the popup script that replicates what the
// browserAction.onClicked event handler would have done.

#ifdef FIREFOX
function processActiveTab () {
  function onGotActiveTab (tabs) {
    for (let tab of tabs) {
      // Security policy only allows us to inject the content script that
      // accesses title and selection for pages loaded with http or https.
      if (tab.url.indexOf('http:') === 0 || tab.url.indexOf('https:') === 0) {
        browser.tabs.executeScript(null, { file: 'content.js' });
      }
      else {
        processLinkData({ href: tab.url, title: '', selection: '' });
      }
    }
  }

  let querying = browser.tabs.query({currentWindow: true, active: true});
  querying.then(onGotActiveTab, onError);
}
#endif
#ifdef CHROME
function processActiveTab () {
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
    let tab = tabs[0];

    if (tab.url.indexOf('http:') === 0 || tab.url.indexOf('https:') === 0) {
      chrome.tabs.executeScript(null, { file: 'content.js' });
    }
    else {
      processLinkData({ href: tab.url, title: '', selection: '' });
    }
  });
}
#endif

/* ---------------------------------------------------------------- */

// Listen for messages from the content script

#ifdef FIREFOX
browser.runtime.onMessage.addListener(
  function (request, sender) {
    processLinkData(request);
  }
);
#endif
#ifdef CHROME
chrome.runtime.onMessage.addListener(
  function (request, sender) {
    processLinkData(request);
  }
);
#endif
