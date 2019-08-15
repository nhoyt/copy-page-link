/*
*   popup.js
*/

function displayMessage () {
  // Invoke the main function of the background script
  let backgroundPage = browser.extension.getBackgroundPage();
  backgroundPage.processActiveTab();

  // Update the popup content with current format set in preferences
  function setFormat (options) {
    document.getElementById('format').textContent = options.format || 'markdown';
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

window.addEventListener("load", displayMessage);
