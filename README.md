# Copy Page Link

Copy Page Link is a browser add-on for Chrome and Firefox that builds a
formatted link to the current page loaded in the active tab, and copies it
to the clipboard. You can then paste the resulting link markup into an
external document.

By default, the page title is used as the display text for the link. You can
override this behavior by selecting a text string within the document — that
string will then be used as the display text instead of the page title.

## Preferences / Options

### Link Format section

This section of the Preferences page allows you to select from the following
link formats:

| Format   | Result                                      |
| -------- | ------------------------------------------- |
| Markdown | `[page-title-or-selection](url)`            |
| DokuWiki | `[[url|page-title-or-selection]]`           |
| HTML     | `<a href="url">page-title-or-selection</a>` |
| LaTeX    | `\href{url}{page-title-or-selection}`       |
| XML      | configured separately (see below)           |

### XML Identifiers section

To configure the XML format, this section allows you to specify:

* The name of the container element for the link
* The name of the attribute on the container element that specifies the URL
  for the link
* The name of the element that describes the link (by default, it will contain
  the page title)

The structure of the XML markup, with default names/identifiers of `link`,
`href` and `name`, is:

`<link href="url"><name>page-title-or-selection</name></link>`

### Notification section

When the Copy Page Link toolbar button is activated, the extension displays a
popup notification window indicating the format in which the link was copied,
and that, by default, will close automatically after a few seconds.

The 'Notification' section of the Preferences page allows you to customize
this behavior as follows:

* Uncheck the 'Automatically close' checkbox: This will cause the popup to
  stay open until you press 'Escape' or click elsewhere in the browser window.
* Check the 'Automatically close' checkbox and select the notification delay
  time for automatically closing the window, from 1.5 to 4.5 seconds.
