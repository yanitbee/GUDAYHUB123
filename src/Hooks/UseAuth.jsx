export const AUTH_KEY_TOKEN = "user.token";
export const AUTH_KEY_USER_DATA = 'userData';

function useAuth() {
  const logIn = (userData, token) => {
    setSessionStorage(AUTH_KEY_USER_DATA, JSON.stringify(userData));
    setSessionStorage(AUTH_KEY_TOKEN, token);
  };

  const logOut = () => {
    removeSessionStorage(AUTH_KEY_USER_DATA);
    removeSessionStorage(AUTH_KEY_TOKEN);
    window.location.reload();
  };

  const isLoggedIn = () => getSessionStorage(AUTH_KEY_TOKEN);

  const getUserData = () => {
    const userDataString = getSessionStorage(AUTH_KEY_USER_DATA);
    return userDataString ? JSON.parse(userDataString) : null;
  };

  const getUserToken = () => {
    return getSessionStorage(AUTH_KEY_TOKEN);
  };

  const setSessionStorage = (key, value) => {
    sessionStorage.setItem(key, value);
  };

  const removeSessionStorage = (key) => {
    sessionStorage.removeItem(key);
  };

  const getSessionStorage = (key) => {
    return sessionStorage.getItem(key);
  };

  return { isLoggedIn, getUserData, getUserToken, logIn, logOut };
}

export default useAuth;
