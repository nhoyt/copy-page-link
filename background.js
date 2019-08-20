/*
*   background.js
*/
var options; // User options retrieved and set by options.js

/*
*   Called from options.js for customizing 'options saved' message
*/
function getPlatform () {
  function gotPlatformInfo (info) {
    browser.runtime.sendMessage(info.os);
  }
  let gettingInfo = browser.runtime.getPlatformInfo();
  gettingInfo.then(gotPlatformInfo);
}

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
  let format = options.format || 'markdown';

  switch (format) {
    case 'markdown':
      return `[${name}](${data.href})`;

    case 'html':
      return `<a href="${data.href}">${name}</a>`;

    case 'xml':
      return `      <${options.link} ${options.href}="${data.href}">\n` +
             `        <${options.name}>${name}</${options.name}>\n` +
             `      </${options.link}>\n`;

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

// Because we've declared a popup for the extension, we need an entry point
// function we can call from the popup script that replicates what the
// browserAction.onClicked event handler would have done.

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

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let querying = browser.tabs.query({currentWindow: true, active: true});
  querying.then(onGotActiveTab, onError);
}

// Listen for messages from the content script
browser.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    processLinkData(request);
  }
);
