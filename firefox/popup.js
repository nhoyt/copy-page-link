/*
*   popup.js
*/
const debug = false;
const defaultFormat = 'markdown';
const defaultTimeout = 3000;

let mouseEnterCount = 0;
let mouseLeaveCount = 0;

let timeoutID;
let timeoutExpired = false;

// Generic error handler for API methods that return Promise
function onError (error) {
  console.log(`Error: ${error}`);
}

/*
*   The main function of the popup is to inform the user that the page link
*   information was copied to the clipboard and in which link format it was
*   copied. While it does have one interactive element, the 'Change Format'
*   button, it is not used to initiate the page link processing.
*
*   Therefore, the popup's load event is used to initiate processing, which
*   is handled by the popupAction function.
*
*   This architecture is used in lieu of what typically happens: either the
*   popup would have interactive elements that would fire events handled by
*   the background script that determine the type of processing that should
*   occur; or there would be no popup, in which case the toolbar button would
*   fire the browserAction.onClicked event, passing it the active tab,
*   likewise to be handled by the background script.
*/
function popupAction () {

  function buttonHasFocus () {
    let button = document.getElementsByTagName('button')[0];
    return button === document.activeElement;
  }

  function startProcessing (options) {

    // Set options var and initiate processing in background script
    function onGotBackgroundPage (page) {
      page.options = options;
      page.processActiveTab();
    }

    browser.runtime.getBackgroundPage().then(onGotBackgroundPage, onError);

    // Update popup content and conditionally close the popup window
    // automatically after user-specified delay.

    // Set the format value in popup message
    document.getElementById('format').textContent = options.format || defaultFormat;

    // Conditionally close the popup window automatically
    let auto = (typeof options.auto === 'undefined') ? true : options.auto;
    let msec = options.msec || defaultTimeout;
    if (auto) {
      timeoutID = setTimeout(function () {
        timeoutExpired = true;
        if (buttonHasFocus() || (mouseEnterCount > mouseLeaveCount)) {
          clearTimeout(timeoutID);
        }
        else {
          window.close();
        }
      }, msec);
    }
  }

  // Get the options data saved in browser.storage
  browser.storage.sync.get().then(startProcessing, onError);
}

/*
*   Handle popup window load event (stand-in for browserAction.onClicked)
*/
window.addEventListener("load", popupAction);

/*
*   Handle popup window options button click event
*/
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("options")) {

    function onOpened () {
      if (debug) console.log('Options page opened!');
    }

    browser.runtime.openOptionsPage().then(onOpened, onError);
  }
});

/*
*   Handlers for mouseenter and mouseleave
*/
document.body.addEventListener("mouseenter", e => {
  mouseEnterCount++;
});

document.body.addEventListener("mouseleave", e => {
  mouseLeaveCount++;
  if (timeoutExpired) {
    setTimeout(function () { window.close(); }, 500);
  }
});
