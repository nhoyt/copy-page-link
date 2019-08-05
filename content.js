/*
*   content.js
*/
var linkData = {
  href: window.location.href,
  title: document.title,
  selection: window.getSelection().toString().trim()
};

browser.runtime.sendMessage(linkData);
