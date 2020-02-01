/*
*   content.js
*/

var data = {
  href: window.location.href,
  selection: window.getSelection().toString().trim(),
  title: document.title
}

#ifdef FIREFOX
browser.runtime.sendMessage(data);
#endif
#ifdef CHROME
chrome.runtime.sendMessage(data);
#endif
