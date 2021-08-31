# CHANGELOG

## v3.1.0
* Updated popup layout
* Added fieldset border
* Updated legend text content
* Updated font sizes and button width

## v3.0.0
* Moved selection of link format to popup window
* Added error message in popup when the protocol of the active tab is not
  'http' or 'https'
* Updated the options form for setting XML names only
* Removed link format 'bbcode'

## v2.4
* Add link formats: 'mediawiki' and 'bbcode'
* Use ES6 modules: add storage.js module
* Refactor using storage imports
* Update styling of options form

## v2.3
* Refactor background script: chaining of promises
* Use messaging to initialize options script variables and call background script function
* Move image files to images subdirectory

## v2.2
* Add NOTES.md file for add-on documentation
* Update the way that custom JavaScript promises are used

## v2.1
* Update icon and logo images

## v2.0
* The extension no longer uses a popup window as the notification vehicle.
  Instead, OS-based notifications are used.
* This allows for fewer permissions: activeTab instead of tabs and all_urls.
* The toolbar button is used to indicate the currently selected link format,
  for example `Copy Page Link: HTML`.

## v1.3.2
* Add keyboard shortcut Ctrl+Shift+U

## v1.3.1
* Add debug variable for conditional console.log output

## v1.3.0
* Add use of GPP for multi-browser development
* Update Options section: rename to 'Notification'
* Update README file with better format examples
* Add CHANGELOG file

## v1.2.0
* Prevent autoclose of notification popup when button has focus

## v1.1.0
* Improved handling of popup autoclose

## v1.0.2
* Minor styling updates

## v1.0.1
* Added 'Change Format' button to notification popup
* Added LaTeX format option
