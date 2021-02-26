/*
*   content.js
*/

var data = {
  id: 'content',
  href: window.location.href,
  selection: window.getSelection().toString().trim(),
  title: document.title
}

browser.runtime.sendMessage(data);
