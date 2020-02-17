'use strict';

  let pushButton = document.getElementById('push');
  let clearButton = document.getElementById('clear');
  let stackDiv = document.getElementById('stack');

  let stack = null;

  chrome.storage.local.get('stack', data => {
    stack = data.stack || [];
    for (let key = 0; key < stack.length; key++) {
      renderItem(stack[key], key);
    }
    renderBadge();
  });

  function createItem() {
    return {
      color: randomColor(),
      tabs: [],
    }
  }

  function renderItem(item, key) {
    let newItem = document.createElement('button');
    newItem.setAttribute('id', 'stack' + key);
    newItem.style.backgroundColor = item.color;
    newItem.onclick = popItem;
    stackDiv.prepend(newItem);
  }

  function renderBadge() {
    let text = '';
    if (stack && stack.length) {
      const key = stack.length - 1;
      const item = stack[key];
      chrome.browserAction.setBadgeBackgroundColor({
        color: item.color,
      });
      text = String.fromCharCode(65 + key);
    }
    chrome.browserAction.setBadgeText({ text })
  }

  function randomColor() {
    return '#' + Math.floor((Math.random() * 16777216)).toString(16);
  }

  function popItem() {
    const len = stack.length;
    if (!len) {
      return;
    }
    const item = stack.pop();
    if (item.tabs && item.tabs.length > 0) {
      chrome.tabs.remove(item.tabs);
    }
    const elementId = "stack" + (len - 1).toString();
    let oldItem = document.getElementById(elementId);
    stackDiv.removeChild(oldItem);
    renderBadge();
    saveState();
  }

  pushButton.onclick = () => {
    if (!stack) {
      return;
    }
    const item = createItem();
    const id = stack.push(item) - 1;
    renderItem(item, id);
    renderBadge();
    saveState();
    setTimeout(() => chrome.tabs.create({}), 200);
  };

  clearButton.onclick = () => {
    stack = [];
    stackDiv.innerHTML = '';
    saveState();
  };

  function saveState() {
    chrome.storage.local.set({ stack });
  }
