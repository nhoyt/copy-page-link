/*
*   background.js
*/
function copyToClipboard (str) {
  var listener = function (event) {
    event.clipboardData.setData('text/plain', str);
    event.preventDefault();
  };
  document.addEventListener('copy', listener);
  document.execCommand('copy', false, null);
  document.removeEventListener('copy', listener);
}

function getFormattedLink (data, options) {
  var name = data.selection ? data.selection : data.title;
  var format = options.format || 'markdown';

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

  var copying = browser.storage.sync.get();
  copying.then(copyLink, onError);
}

browser.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    processLinkData(request);
  }
);

browser.browserAction.onClicked.addListener(function (tab) {
  // We can only inject scripts to find the title on pages loaded with http
  // and https, so for all other pages, we don't access the title.
  if (tab.url.indexOf('http:') != 0 && tab.url.indexOf('https:') != 0) {
    var data = { href: tab.url, title: '', selection: '' };
    processLinkData(data);
  }
  else {
    browser.tabs.executeScript(null, {file: 'content.js'});
  }
});
