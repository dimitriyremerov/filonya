'use strict';

const pushButton = document.getElementById('push');
const clearButton = document.getElementById('clear');
const stackDiv = document.getElementById('stack');

const getElementId = (key) =>  "stack" + Number(key).toString();
const getElement = (key) => document.getElementById(getElementId(key));

const initView = async () => renderStack(await getStack());

const renderStack = (stack) => {
  stackDiv.innerHTML = '';
  for (let key = 0; key < stack.length - 1; key++) {
    renderItem(stack[key], key);
  }
  const [item, key] = getLastItem(stack);
  renderItem(item, key, true);
  renderBadge(item, key);
};

const renderItem = (item, key, last = false) => {
  if (!item || key === null) {
    return;
  }
  let itemView = document.createElement('button');
  itemView.setAttribute('id', getElementId(key));
  itemView.innerHTML = item.label;
  itemView.style.backgroundColor = item.color;
  stackDiv.prepend(itemView);
  if (last) {
    getElement(key).onclick = processPopAction; // this only makes sense for the last item (for now)
  }
};

const processPushAction = async () => {
  const [item, key] = await pushItem();
  renderItem(item, key, true);
};

const processPopAction = async () => {
  const [, key] = await popItem();
  stackDiv.removeChild(getElement(key));
};

const processClearAction = () => {
  clearAllItems().then(() => {});
  renderStack([]);
};

pushButton.onclick = processPushAction;
clearButton.onclick = processClearAction;
initView().then(() => {});
