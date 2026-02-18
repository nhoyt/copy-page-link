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

async function writeClipboardText (text) {
  try {
    await navigator.clipboard.writeText(text);
  }
  catch (error) {
    console.error(error.message);
  }
}

function notifySuccess (format) {
  console.log(`Copied page link using ${format} format!`);
}

// Listen for message from background script
async function messageHandler (data, sender) {
  if (data.id === 'linkText') {
    try {
      await writeClipboardText(data.linkText);
      notifySuccess(data.format);
    }
    catch (error) {
      console.error('messageHandler', error.message);
    }
  }
}
browser.runtime.onMessage.addListener(messageHandler);
