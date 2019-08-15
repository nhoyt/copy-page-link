/*
*   popup.js
*/

function browserAction () {
  // Invoke the main function of the background script
  let backgroundPage = browser.extension.getBackgroundPage();
  backgroundPage.processActiveTab();

  // Get the user preferences settings, update the popup.html content,
  // and close the popup window automatically after timed delay.
  let defaultFormat = 'markdown';

  function setFormat (options) {
    document.getElementById('format').textContent = options.format || defaultFormat;
  }

  function onError (error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get();
  getting.then(setFormat, onError);

  setTimeout(function () {
    window.close();
  }, 2500);
}

window.addEventListener("load", browserAction);
