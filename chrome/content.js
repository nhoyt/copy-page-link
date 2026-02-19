/*
*   content.js
*/

var browser = chrome || browser;

// Send message to background script
browser.runtime.sendMessage({
  id: 'content',
  href: window.location.href,
  selection: window.getSelection().toString().trim(),
  title: document.title
});

function writeToClipboard (text) {
  let listener = event => {
    event.clipboardData.setData('text/plain', text);
    event.preventDefault();
  };

  document.addEventListener('copy', listener);
  document.execCommand('copy', false, null);
  document.removeEventListener('copy', listener);
}

function notifySuccess (format) {
  console.log(`Copied page link using ${format} format!`);
}

// Listen for message from background script
browser.runtime.onMessage.addListener(messageHandler);

function messageHandler (data, sender) {
  if (data.id === 'linkText') {
    writeToClipboard(data.linkText);
    notifySuccess(data.format);
  }
}
