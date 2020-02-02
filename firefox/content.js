/*
*   content.js
*/

var data = {
  href: window.location.href,
  selection: window.getSelection().toString().trim(),
  title: document.title
}

browser.runtime.sendMessage(data);
