'use strict';

chrome.tabs.onCreated.addListener((tab) => {
  chrome.storage.local.get(['stack'], data => {
    const stack = data.stack;
    if (!stack || !stack.length || !tab.id) {
      return;
    }
    stack[stack.length - 1].tabs.push(tab.id);
    chrome.storage.local.set({ stack });
  });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  console.log(tabId);
  chrome.storage.local.get(['stack'], data => {
    console.log(data);
    let stack = data.stack;
    console.log(stack);
    if (!stack || !stack.length) {
      return;
    }
    stack = stack.map(item => {
      item.tabs = item.tabs.filter(id => id !== tabId);
      return item;
    });
    console.log(stack);

    if (stack[stack.length - 1].tabs.length === 0) {
      stack.pop(); // only removing the element from the stack if it's the top one
    }
    console.log(stack);

    chrome.storage.local.set({ stack });
  });

});

chrome.commands.onCommand.addListener(function(command) {
  switch (command) {
    case "new-context":
      //TODO
      break;
    default:
      break;
  }
});
