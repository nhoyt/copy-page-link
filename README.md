# Copy Page Link

Copy Page Link is a browser add-on for Chrome and Firefox that creates a
formatted link to the current page loaded in the active tab, and copies it
to the clipboard. You can then paste the resulting link markup into an
external document.

By default, the page title is used as the display text for the link. You can
override this behavior by selecting a text string within the document — that
string will then be used as the display text instead of the page title.

## Link Formats

| Format    | Result                                      |
| --------- | ------------------------------------------- |
| HTML      | `<a href="URL">page-title-or-selection</a>` |
| LaTeX     | `\href{URL}{page-title-or-selection}`       |
| Markdown  | `[page-title-or-selection](URL)`            |
| MediaWiki | `[URL page-title-or-selection]`             |
| XML       | configured in Options (see below)           |

## Preferences / Options

### XML Identifiers

To configure the XML format, the options page allows you to specify:

* The name of the container element for the link
* The name of the attribute on the container element that specifies the URL
  for the link
* The name of the element that describes the link (by default, the page title)

For example, with the identifiers set to `page`, `href` and `title`,
respectively, the formatted XML markup would appear as follows:

    <page href="url">
      <title>page-title-or-selection</title>
    </page>
