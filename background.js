// background.js

function copyToClipboard (str) {
  var listener = function (event) {
    event.clipboardData.setData('text/plain', str);
    event.preventDefault();
  };
  document.addEventListener('copy', listener);
  document.execCommand('copy', false, null);
  document.removeEventListener('copy', listener);
}

function getFormattedLink (data, format) {
  var name = data.selection ? data.selection : data.title;

  switch (format) {
    case 'site':
      return '      <site href="' + data.href + '">\n' +
             '        <name>' + name + '</name>\n' +
             '      </site>\n';

    case 'markdown':
      return '[' + name + '](' + data.href + ')';

    case 'html':
      return '<a href="' + data.href + '">' + name + '</a>';

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
  chrome.storage.sync.get({ linkFormat: 'site' },
    function (result) {
      var format = result.linkFormat;
      copyToClipboard(getFormattedLink(data, format));
    });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    processLinkData(request);
  }
);

chrome.browserAction.onClicked.addListener(function(tab) {
  // We can only inject scripts to find the title on pages loaded with http
  // and https, so for all other pages, we don't access the title.
  if (tab.url.indexOf('http:') != 0 && tab.url.indexOf('https:') != 0) {
    var data = { href: tab.url, title: '', selection: '' };
    processLinkData(data);
  }
  else {
    chrome.tabs.executeScript(null, {file: 'content.js'});
  }
});
