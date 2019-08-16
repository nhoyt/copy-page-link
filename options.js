/*
*   Save user options to browser.storage
*/
function saveOptions(e) {
  e.preventDefault();

  let formats = document.getElementById('formats');
  let inputs = formats.getElementsByTagName('input');
  let selectedFormat = null;

  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].checked) {
      selectedFormat = inputs[i].value;
      break;
    }
  }

  function notifyUser () {
    let status = document.getElementById('status');
    status.textContent = 'Preferences saved.';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
    console.log('Preferences saved!');
  }

  function onError (error) {
    console.log(`Error: ${error}`);
  }

  if (selectedFormat) {
    let setting = browser.storage.sync.set({
      format: selectedFormat,
      link: document.getElementById('link').value,
      href: document.getElementById('href').value,
      name: document.getElementById('name').value
    });
    setting.then(notifyUser, onError);
  }
}

/*
*   Restore HTML form values based on user options saved in browser.storage
*/
function restoreOptions() {
  const defaultFormat = 'markdown';

  function setPreferences (options) {
    document.getElementById(options.format || defaultFormat).checked = true;
    document.getElementById('link').value = options.link || 'link';
    document.getElementById('href').value = options.href || 'href';
    document.getElementById('name').value = options.name || 'name';
  }

  function onError (error) {
    console.log(`Error: ${error}`);
  }

  let getting = browser.storage.sync.get();
  getting.then(setPreferences, onError);
}

/*
*   Add the event listeners for saving and restoring options
*/
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
