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
    setTimeout(async () => {
      await navigator.clipboard.writeText(text);
    }, 50);
  }
  catch (error) {
    console.error(`writeClipboardText: ${error.message}`);
  }
}

function notifySuccess (format) {
  console.log(`Copied page link using ${format} format!`);
}

// Listen for message from background script
browser.runtime.onMessage.addListener(messageHandler);

async function messageHandler (data, sender) {
  if (data.id === 'linkText') {
    await writeClipboardText(data.linkText);
    notifySuccess(data.format);
  }
}
