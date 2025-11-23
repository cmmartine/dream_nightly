export const retrieveLocalStorageData = (key) => {
  let data = '';
  try {
    data = JSON.parse(localStorage.getItem(key)) || '';
  } catch (e) {
    console.error(`Failed to retrieve local storage key ${key}:`, e);
  }
  return data;
};

export const setLocalStorageData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to set local storage key ${key}:`, e);
  }
};

export const removeLocalStorageData = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`Failed to remove local storage key ${key}:`, e);
  }
};