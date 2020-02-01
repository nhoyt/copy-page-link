/*
*   content.js
*/
browser.runtime.sendMessage({
  href: window.location.href,
  selection: window.getSelection().toString().trim(),
  title: document.title
});
