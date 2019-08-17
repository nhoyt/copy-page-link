# Copy Link

The Copy Link extension builds a formatted link to the current page being
viewed in your browser and copies it to the clipboard. You can then paste
the link markup into an external document.

By default, the page title is used as the display text for the link. You can
override this behavior by selecting a text string within the document — that
string will then be used as the display text instead of the page title.

The Preferences page allows you to select from the following link formats:

* Markdown: \[title | selection\]\(url\)
* HTML: &lt;a href="url"&gt;title | selection&lt;/a&gt;
* XML: configured separately

To configure the XML format, you specify:

* The name of the link (container) element
* The name of the link element's URL attribute
* The name of the page title element

The structure of the XML markup, with default names, is:

`<link href=""><name></name></link>`

## About the Notification Popup

When the Copy Link toolbar button is activated, the extension displays a popup
notification window that, by default, will close automatically after a few
seconds.

The Preferences page allows you to customize this behavior as follows:

* Uncheck the 'Automatically close' checkbox: This will cause the popup to
  stay open until you hit 'Escape' or click elsewhere in the browser.
* Set the notification timeout (delay time for closing the window) from a range
  of 1.5 to 4.5 seconds.
