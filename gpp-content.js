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

#ifdef CHROME
function writeToClipboard (text) {
  let listener = event => {
    event.clipboardData.setData('text/plain', text);
    event.preventDefault();
  };

  document.addEventListener('copy', listener);
  document.execCommand('copy', false, null);
  document.removeEventListener('copy', listener);
}
#endif
#ifdef FIREFOX
async function writeClipboardText (text) {
  try {
    setTimeout(async () => {
      await navigator.clipboard.writeText(text);
    }, 50);
  }
  catch (error) {
    console.error(`writeClipboardText: ${error.message}`);
  }
}
#endif

function notifySuccess (format) {
  console.log(`Copied page link using ${format} format!`);
}

// Listen for message from background script
browser.runtime.onMessage.addListener(messageHandler);

#ifdef CHROME
function messageHandler (data, sender) {
  if (data.id === 'linkText') {
    writeToClipboard(data.linkText);
    notifySuccess(data.format);
  }
}
#endif
#ifdef FIREFOX
async function messageHandler (data, sender) {
  if (data.id === 'linkText') {
    await writeClipboardText(data.linkText);
    notifySuccess(data.format);
  }
}
#endif
