/*
*   Save user options to browser.storage
*/
function saveOptions(e) {
  e.preventDefault();

  var formats = document.getElementById('formats');
  var inputs = formats.getElementsByTagName('input');
  var selectedFormat = null;

  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].checked) {
      selectedFormat = inputs[i].value;
      break;
    }
  }

  function notifyUser () {
    var status = document.getElementById('status');
    status.innerHTML = 'Options saved.';
    setTimeout(function () {
      status.innerHTML = '';
    }, 750);
    console.log('Options saved!');
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  if (selectedFormat) {
    var setting = browser.storage.sync.set({ format: selectedFormat });
    setting.then(notifyUser, onError);
  }
}

/*
*   Restore HTML form values based on user options saved in browser.storage
*/
function restoreOptions() {

  function setCurrentChoice (result) {
    document.getElementById(result.format || 'markdown').checked = true;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.sync.get('format');
  getting.then(setCurrentChoice, onError);
}

/*
*   Add the event listeners for saving and restoring options
*/
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
