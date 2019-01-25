// Save user options to chrome.storage
function saveOptions() {
  var selectedOption;

  var options = document.getElementsByTagName('input');
  for (var i = 0; i < options.length; i++) {
    if (options[i].checked) {
      selectedOption = options[i].value;
      break;
    }
  }

  chrome.storage.sync.set(
    {
      linkFormat: selectedOption
    },
    function () {
      // Update status to let user know options were saved
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 1250);
    }
  );
}

// Restore UI state based on user options saved in chrome.storage
function restoreOptions() {
  chrome.storage.sync.get(['linkFormat'],
    function (result) {
      var id = result.linkFormat;
      document.getElementById(id).checked = true;
    }
  );
}

// Add the event listeners for saving and restoring options
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
