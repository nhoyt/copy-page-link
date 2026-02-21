/* background.js */

import { extensionName, linkFormats, getOptions } from './storage.js';
const browser = chrome || browser;

/*
**  getFormattedLink: The main function for extracting and processing
**  the data used for creating the formatted link markup.
*/
function getFormattedLink (data, options) {
  // Truncate selection string if length exceeds maximum
  const maxLength = 120;
  if (data.selection && data.selection.length > maxLength) {
    data.selection = data.selection.substring(0, maxLength) + '…';
  }

  // Construct and return the link markup based on format option
  let name = data.selection ? data.selection : data.title;
  let format = options.format;

  switch (format) {
    case 'html':
      return `<a href="${data.href}">${name}</a>`;

    case 'latex':
      return `\\href{${data.href}}{${name}}`;

    case 'markdown':
      return `[${name}](${data.href})`;

    case 'mediawiki':
      return `[${data.href} ${name}]`;

    case 'rawurl':
      return `${data.href}`;

    case 'xml':
      return `      <${options.link} ${options.href}="${data.href}">\n` +
             `        <${options.name}>${name}</${options.name}>\n` +
             `      </${options.link}>\n`;

    default:
      return 'Error: Unknown format option';
  }
}

// Send back the results for copying to clipboard
async function sendFormattedLinkData (formattedLink, options) {
  const message = {
    id: 'linkText',
    format: linkFormats.get(options.format),
    linkText: formattedLink
  };
  const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
  const response = await browser.tabs.sendMessage(tab.id, message);
}

// Listen for message from content script
browser.runtime.onMessage.addListener(messageHandler);

async function messageHandler (data, sender) {
  if (data.id === 'content') {
    const options = await getOptions();
    const formattedLink = getFormattedLink(data, options);
    sendFormattedLinkData(formattedLink, options);
  }
}
