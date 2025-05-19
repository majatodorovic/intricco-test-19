// Save data with expiration
export const saveToLocalStorage = (key, value, ttl = 3 * 24 * 60 * 60 * 1000) => {
  const expirationTime = Date.now() + ttl;
  const data = {
    value,
    expiresAt: expirationTime,
  };
  localStorage.setItem(key, JSON.stringify(data));
};

// Check data in localStorage
export const getDataFromLocalStorage = (key) => {
  const data = JSON.parse(localStorage.getItem(key));
  if (data && data.expiresAt > Date.now()) {
    return data.value;
  } else {
    //Delete if expired
    localStorage.removeItem(key);
    return null;
  }
};
