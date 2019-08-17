/*
*   popup.js
*/
const defaultFormat = 'markdown';
const defaultTimeout = 2500;
const minTimeout = 1500;

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

    // Set the delay time for closing the popup window
    let msec = parseInt(options.msec, 10);
    if (isNaN(msec)) {
      console.log('Warning: Copy Link \'Notification Timeout\' value (' +
                  options.msec + ') could not be parsed as an integer.');
      msec = defaultTimeout;
    }
    if (msec >= minTimeout) {
      setTimeout(function () { window.close(); }, msec);
    }
  }

  function onError (error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get();
  getting.then(startProcessing, onError);
}

window.addEventListener("load", browserAction);
