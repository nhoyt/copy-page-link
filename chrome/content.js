/*
*   content.js
*/

var data = {
  id: 'content',
  href: window.location.href,
  selection: window.getSelection().toString().trim(),
  title: document.title
}

chrome.runtime.sendMessage(data);
