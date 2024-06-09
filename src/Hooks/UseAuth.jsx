export const AUTH_KEY_TOKEN = "user.token";
export const AUTH_KEY_USER_DATA = 'userData';

function useAuth() {
  const logIn = (userData, token) => {
    setLocalStorage(AUTH_KEY_USER_DATA, JSON.stringify(userData));
    setLocalStorage(AUTH_KEY_TOKEN, token);
  };

  const logOut = () => {
    removeLocalStorage(AUTH_KEY_USER_DATA);
    removeLocalStorage(AUTH_KEY_TOKEN);
    window.location.reload();
  };

  const isLoggedIn = () => getLocalStorage(AUTH_KEY_TOKEN);

  const getUserData = () => {
    const userDataString = getLocalStorage(AUTH_KEY_USER_DATA);
    return userDataString ? JSON.parse(userDataString) : null;
  };

  const getUserToken = () => {
    return getLocalStorage(AUTH_KEY_TOKEN);
  };

  const setLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
  };

  const removeLocalStorage = (key) => {
    localStorage.removeItem(key);
  };

  const getLocalStorage = (key) => {
    return localStorage.getItem(key);
  };

  return { isLoggedIn, getUserData, getUserToken, logIn, logOut };
}

export default useAuth;
