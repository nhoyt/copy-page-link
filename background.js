/*
*   background.js
*/

function copyToClipboard (str) {
  let listener = function (event) {
    event.clipboardData.setData('text/plain', str);
    event.preventDefault();
  };
  document.addEventListener('copy', listener);
  document.execCommand('copy', false, null);
  document.removeEventListener('copy', listener);
}

function getFormattedLink (data, options) {
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

  // Copy the user-specified link format to clipboard
  function copyLink (options) {
    copyToClipboard(getFormattedLink(data, options));
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get();
  getting.then(copyLink, onError);
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
  function(request, sender, sendResponse) {
    processLinkData(request);
  }
);

/*
browser.browserAction.onClicked.addListener(function (tab) {
  // Security policy only allows us to inject the content script that
  // accesses title and selection for pages loaded with http or https.
  if (tab.url.indexOf('http:') === 0 || tab.url.indexOf('https:') === 0) {
    browser.tabs.executeScript(null, { file: 'content.js' });
  }
  else {
    processLinkData({ href: tab.url, title: '', selection: '' });
  }
});
*/
