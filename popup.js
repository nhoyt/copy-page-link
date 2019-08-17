/*
*   popup.js
*/
const defaultFormat = 'markdown';

function browserAction () {

  function startProcessing (options) {

    // Set options var and initiate processing in background script
    let backgroundPage = browser.extension.getBackgroundPage();
    backgroundPage.options = options;
    backgroundPage.processActiveTab();

    // Update popup content and conditionally close the popup window
    // automatically after user-specified delay.

    // Set the format value in popup message
    document.getElementById('format').textContent = options.format || defaultFormat;

    // Conditionally close the popup window automatically
    if (options.auto) {
      setTimeout(function () { window.close(); }, options.msec);
    }
  }

  function onError (error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get();
  getting.then(startProcessing, onError);
}

window.addEventListener("load", browserAction);
