export const updateItem = (items, update, index) => {
  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

export const deleteItem = (items, index) => {
  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    ...items.slice(index + 1)
  ];
};

export const isOnline = () => {
  return window.navigator.onLine;
};
