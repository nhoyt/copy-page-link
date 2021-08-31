## Documentation Notes

Copy Page Link creates link markup for the current page in the selected format
and copies it to the clipboard for pasting into another document.

### Keyboard Accessibility

* The keyboard shortcut for Copy Page Link is 'alt-1' ('option-1' on the Mac).
* Copy Page Link "remembers" the last link format that was copied. To select
  another link format, use 'arrow-up' or 'arrow-down' to move through the list.
* When the desired link format is selected, press 'return' or 'enter' to copy
  the formatted link to the clipboard.

### Details

Copy Page Link provides the following choices for link format:

* HTML
* LaTeX
* Markdown (default)
* MediaWiki
* XML

The formatted link consists of (1) the page URL and (2) the link text. By
default, the <em>page title</em> is used as the link text. However, if there
is a <em>text selection</em> on the web page, it will be used as the link text
<em>instead of</em> the page title.

To use the XML format, you can configure the names of the XML elements and
attributes on the options page.

### Screenshot

Copy Page Link

Examples of page links copied with each of the link format options selected:

HTML:
<a href="https://en.wikipedia.org/wiki/Main_Page">Wikipedia, the free encyclopedia</a>

LaTeX:
\href{https://en.wikipedia.org/wiki/Main_Page}{Wikipedia, the free encyclopedia}

Markdown:
[Wikipedia, the free encyclopedia](https://en.wikipedia.org/wiki/Main_Page)

MediaWiki:
[https://en.wikipedia.org/wiki/Main_Page Wikipedia, the free encyclopedia]

XML:
<site href="https://en.wikipedia.org/wiki/Main_Page">
  <name>Wikipedia, the free encyclopedia</name>
</site>
