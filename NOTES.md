## Documentation Notes

### Version 2.x

Copy Page Link creates a formatted link to the current page and copies it to
the clipboard.

The options page provides the following choices for link format: (1) Markdown
(default) (2) MediaWiki (3) BBCode (4) HTML (5) LaTeX and (6) XML.

The formatted link consists of (1) the page URL and (2) the link text. By
default, the <em>page title</em> is used as the link text. However, if there
is a <em>text selection</em> on the web page, it will be used as the link text
<em>instead of</em> the page title.

To use the XML format, you will typically want to configure the names of the
XML elements and attributes on the add-on's options page.

### Screenshot

Copy Page Link

Examples of page links copied with each of the link format options selected:

Markdown:
[Wikipedia, the free encyclopedia](https://en.wikipedia.org/wiki/Main_Page)

MediaWiki:
[https://en.wikipedia.org/wiki/Main_Page Wikipedia, the free encyclopedia]

BBCode:
[url=https://en.wikipedia.org/wiki/Main_Page]Wikipedia, the free encyclopedia[/url]

HTML:
<a href="https://en.wikipedia.org/wiki/Main_Page">Wikipedia, the free encyclopedia</a>

LaTeX:
\href{https://en.wikipedia.org/wiki/Main_Page}{Wikipedia, the free encyclopedia}

XML:
<site href="https://en.wikipedia.org/wiki/Main_Page">
  <name>Wikipedia, the free encyclopedia</name>
</site>

### Version 1.x

The Copy Page Link add-on copies a formatted link to the page currently being viewed in the active tab. Once copied, it can be pasted from the clipboard using standard keyboard shortcuts such as ctrl-v or cmd-v, or by selecting Paste from an Edit or context menu.

The four link formats currently supported are:

* Markdown
* HTML
* LaTeX
* XML
