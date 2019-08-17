/*
*   popup.js
*/
const defaultFormat = 'markdown';
const defaultTimeout = 2500;
const minTimeout = 1500;

function browserAction () {
  // Invoke the main function of the background script
  let backgroundPage = browser.extension.getBackgroundPage();
  backgroundPage.processActiveTab();

  // Get the user preferences settings, update the popup.html content,
  // and close the popup window automatically after timed delay.
  function updateFromUserPrefs (options) {
    // Set the format value
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
  getting.then(updateFromUserPrefs, onError);
}

window.addEventListener("load", browserAction);
