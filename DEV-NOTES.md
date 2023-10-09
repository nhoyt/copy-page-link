# Development Notes

## New Feature: Enable/Disable Formats

In Preferences/Options, display the list of all link formats, each with a checkbox, and allow the user to enable only the formats she cares about. The result will be that only the enabled formats will be displayed in the extension popup window when it is activated.

### Edge Cases

1. The user should not be allowed to disable all formats. When this happens, include at least the default option (markdown).

2. The selected option in the popup is based on the default the first time it is displayed, and the last selected format for all subsequent activations of the popup window. When the last selected format is disabled by the user in Preferences, the heuristic for "selected format" becomes (a) the default format if it is currently in the list, or (b) the first item in the list, when the default format is not enabled.
