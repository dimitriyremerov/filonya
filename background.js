'use strict';

chrome.tabs.onCreated.addListener((tab) => {
  chrome.storage.local.get('stack', data => {
    const stack = data.stack;
    if (!stack || !stack.length) {
      return;
    }
    const context = stack.pop();
    context.tabs.push(tab.id);
    console.log(context);
    stack.push(context);
    chrome.storage.local.set({stack});
  });
});
