/*
*   popup.js
*/
const defaultFormat = 'markdown';
const defaultTimeout = 3000;

/*
*   The popup does not have any interactive elements; its function is simply
*   to inform the user that the link information was copied to the clipboard
*   and in which link format it was copied.
*
*   Therefore, the popup's load event is used to initiate processing, which
*   is handled by the popupAction function.
*
*   This architecture is used in lieu of what typically happens: either the
*   popup would have interactive elements that would fire events handled by
*   the background script, or there would be no popup, in which case the
*   toolbar button would fire the browserAction.onClicked event, passing it
*   the active tab, likewise to be handled by the background script.
*/
function popupAction () {

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
    let auto = (typeof options.auto === 'undefined') ? true : options.auto;
    let msec = options.msec || defaultTimeout;
    if (auto) {
      setTimeout(function () { window.close(); }, msec);
    }
  }

  function onError (error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get();
  getting.then(startProcessing, onError);
}

window.addEventListener("load", popupAction);

/*
*   Handler for click event on the 'Change Format' button.
*/
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("options")) {

    function onOpened() {
      console.log('Options page opened!');
    }

    function onError(error) {
      console.log(`Error: ${error}`);
    }

    let opening = browser.runtime.openOptionsPage();
    opening.then(onOpened, onError);
  }
});
