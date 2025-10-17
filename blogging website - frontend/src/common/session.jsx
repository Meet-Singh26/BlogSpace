/**
 * Stores a key-value pair in the browser's session storage.
 * Session storage is temporary and is cleared when the page session ends.
 * @param {string} key - The key to store the value under.
 * @param {string} value - The value to be stored.
 */
export const storeInSession = (key, value) => {
  sessionStorage.setItem(key, value);
};

/**
 * Retrieves a value from session storage by its key.
 * @param {string} key - The key of the item to retrieve.
 * @returns {string | null} The value associated with the key, or null if the key is not found.
 */
export const lookInSession = (key) => {
  return sessionStorage.getItem(key);
};

/**
 * Removes an item from session storage by its key.
 * @param {string} key - The key of the item to remove.
 */
export const removeFromSession = (key) => {
  return sessionStorage.removeItem(key);
};

/**
 * Clears all items from session storage for the current domain.
 * This is useful for logging out a user.
 */
export const logOutUser = () => {
  sessionStorage.clear();
};
