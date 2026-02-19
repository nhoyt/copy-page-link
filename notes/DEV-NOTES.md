# Development Notes

## New Feature: Enable/Disable Formats

In Preferences/Options, display the list of all link formats, each with a checkbox, and allow the user to enable only the formats they care about. The result will be that only the enabled formats will be displayed in the extension popup window when it is activated.

### Edge Cases

1.  The user disables (i.e., deselects) all link formats, meaning the popup
    menu would have no items:

    * When the 'Save' button is activated in such a case, the extension uses the defaultDisplaySettings to reset the Link Formats portion of the form,
    and displays the saveOverride message.

    The end result is that there will always be at least one item displayed in the popup menu.

2.  The last selected format is no longer in the popup menu:

  The 'selected format' in the popup is based on the 'default format' the first time it is displayed, and on the 'last selected format' for all subsequent activations of the popup window. When the last selected format is disabled by the user in Preferences, the heuristic for 'selected format' becomes (a) the default format if it is currently in the list, or (b) the first format in the list, when the default format is not enabled (i.e., in the menu).

## Migrating Promise code to async/await and proper handling of async functions

The following functions used in this extension are asynchronous:

* browser.scripting.executeScript
* navigator.clipboard.writeText

* copyPageLink
* getOptions, saveOptions
