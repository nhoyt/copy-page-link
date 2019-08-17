# Copy Link

The Copy Link extension builds a link to the current page being viewed in your
browser and copies it to the clipboard. You can then paste the formatted link
markup into an external document.

By default, the page title is used as the display text for the link. You can
override this behavior by selecting a text string within the document — that
string will then be used as the display text instead of the page title.

The Preferences page allows you to select from the following link formats:

* Markdown
* HTML &lt;a&gt; element
* XML

The page also allows you to specify the names of the XML container element,
its attribute and child element to be used when the XML format is selected.

The structure of the XML markup, with default names, is:

`<link href=""><name></name></link>`
