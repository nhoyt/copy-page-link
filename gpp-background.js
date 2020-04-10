/*
*   background.js
*/
const debug = false;
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
    if (debug) console.log(str);
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

    case 'dokuwiki':
      return `[[${data.href}|${name}]]`;

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

// Because we've declared a popup for the extension, we need an entry
// point function we can call from the popup script that replicates what
// the browserAction.onClicked event handler would have done. That entry
// point is the processActiveTab function.

const queryInfo = {currentWindow: true, active: true};

// Security policy only allows us to inject the content script that
// accesses title and selection for pages loaded with http or https.

function checkUrlProtocol (tab) {
  return (tab.url.indexOf('http:') === 0 || tab.url.indexOf('https:') === 0);
}

#ifdef FIREFOX
function processActiveTab () {
  function onGotActiveTab (tabs) {
    if (checkUrlProtocol(tabs[0])) {
      browser.tabs.executeScript(null, { file: 'content.js' });
    }
    else {
      processLinkData({ href: tabs[0].url, title: '', selection: '' });
    }
  }

  browser.tabs.query(queryInfo).then(onGotActiveTab, onError);
}
#endif
#ifdef CHROME
function processActiveTab () {
  chrome.tabs.query(queryInfo, function (tabs) {
    if (checkUrlProtocol(tabs[0])) {
      chrome.tabs.executeScript(null, { file: 'content.js' });
    }
    else {
      processLinkData({ href: tabs[0].url, title: '', selection: '' });
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
