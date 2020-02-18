'use strict';
const loadStorage = (cb) => chrome.storage.local.get(['stack'], cb);
const saveStorage = async (data) => new Promise(resolve => chrome.storage.local.set(data, resolve));

let stackPromise = new Promise(resolve => loadStorage(data => resolve(data.stack || [])));

const pushItem = async () => {
    const stack = await stackPromise;
    const item = createItem();
    const key = stack.push(item) - 1;
    item.label = getItemLabel(key);
    renderBadge(item, key);
    await saveStorage({ stack });
    setTimeout(() => chrome.tabs.create({}), 200);
    return [item, key];
};

const popItem = async () => {
    const stack = await stackPromise;
    if (stack.length === 0) {
        return;
    }
    const item = stack.pop();
    if (item.tabs && item.tabs.length > 0) {
        chrome.tabs.remove(item.tabs);
    }
    renderBadge(...getLastItem(stack));
    saveStorage({ stack }).then(() => {});
    return [item, stack.length]; // New length after pop() so no need to subtract 1
};

const clearAllItems = async () => {
    let stack = await stackPromise;
    stack.length = 0;
    saveStorage( { stack }).then(() => {});
    renderBadge(null, null);
};

const renderBadge = (lastItem = null, lastKey = null) => {
    if (!lastItem || lastKey === null) {
        chrome.browserAction.setBadgeText({ text: '' }); // Will reset label after the last element popped
        return;
    }

    chrome.browserAction.setBadgeBackgroundColor({
        color: lastItem.color,
    });
    chrome.browserAction.setBadgeText({ text: lastItem.label });
};

const getLastItem = (stack) => {
    if (!stack.length) {
        return [null, null];
    }
    const key = stack.length - 1;

    return [stack[key], key];
};

// const refreshBadge = async () => renderBadge(getLastItem(await stackPromise));

const createItem = () => ({
    color: getRandomColor(),
    tabs: [],
    label: '',
});
const getItemLabel = (key) => (key + 1).toString();
const getRandomColor = () => '#' + Math.floor(1 + (Math.random() * 16777215)).toString(16).toUpperCase();
