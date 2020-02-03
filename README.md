# Copy Page Link

Copy Page Link is a browser add-on for Chrome and Firefox that builds a
formatted link to the current page in the active tab and copies it to the
clipboard. You can then paste the resulting link markup into an external
document.

By default, the page title is used as the display text for the link. You can
override this behavior by selecting a text string within the document — that
string will then be used as the display text instead of the page title.

The Copy Page Link Preferences page allows you to select from the following
link formats:

| Format   | Result                                 |
| -------- | -------------------------------------- |
| Markdown | `[title-or-selection](url)`            |
| HTML     | `<a href="url">title-or-selection</a>` |
| LaTeX    | `\href{url}{title-or-selection}`       |
| XML      | configured separately (see below)      |

To configure the XML format, you specify:

* The name of the link (container) element
* The name of the link element's URL attribute
* The name of the page title (or selected text) element

The structure of the XML markup, with default names, is:

`<link href="url"><name>title-or-selection</name></link>`

## About the Notification Popup

When the Copy Page Link toolbar button is activated, the extension displays a
popup notification window that, by default, will close automatically after a
few seconds.

The Preferences page allows you to customize this behavior as follows:

* Uncheck the 'Automatically close' checkbox: This will cause the popup to
  stay open until you hit 'Escape' or click elsewhere in the browser.
* Set the notification timeout (delay time for automatically closing the
  window) from a range of 1.5 to 4.5 seconds.
