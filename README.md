# Copy Page Link

Copy Page Link is a browser add-on for Chrome and Firefox that creates a
formatted link to the current page loaded in the active tab, and copies it
to the clipboard. You can then paste the resulting link markup into an
external document.

By default, the page title is used as the display text for the link. You can
override this behavior by selecting a text string within the document — that
string will then be used as the display text instead of the page title.

## Notifications

When the Copy Page Link toolbar button is activated, a notification is created
with behaviors that are based on how you have configured Notifications within
your operating system preferences. For example, you can choose to be alerted
by notifications as banners or you can turn off all notifications for your
browser, among other options.

The notification message, which displays in the Notification Center, indicates
the format in which the link was copied.

Additionally, the tooltip displayed when you hover over the Copy Page Link
toolbar button indicates the currently selected link format.

## Preferences / Options

### Link Format section

This section of the Preferences page allows you to select from the following
link formats (placeholders are `URL` and `page-title-or-selection`):

| Format    | Result                                      |
| --------- | ------------------------------------------- |
| Markdown  | `[page-title-or-selection](URL)`            |
| MediaWiki | `[URL page-title-or-selection]`             |
| BBCode    | `[url=URL]page-title-or-selection[/url]`    |
| HTML      | `<a href="URL">page-title-or-selection</a>` |
| LaTeX     | `\href{URL}{page-title-or-selection}`       |
| XML       | configured separately (see below)           |

### XML Identifiers section

To configure the XML format, this section allows you to specify:

* The name of the container element for the link
* The name of the attribute on the container element that specifies the URL
  for the link
* The name of the element that describes the link (by default, the page title)

The structure of the XML markup, with default names/identifiers of `site`,
`href` and `name`, is:

`<site href="url"><name>page-title-or-selection</name></link>`
