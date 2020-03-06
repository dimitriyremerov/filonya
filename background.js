'use strict';

chrome.tabs.onCreated.addListener(async (tab) => {
  const stack = await getStack();
  if (!stack || !stack.length || !tab.id) {
    return;
  }
  stack[stack.length - 1].tabs.push(tab.id);
  await saveStorage({ stack });
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  let stack = await getStack();
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
  await saveStorage({ stack });
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "new-context") {
    await pushItem();
  }
});
