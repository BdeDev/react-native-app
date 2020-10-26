/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author    : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of ToXSL Technologies Pvt. Ltd. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

import AsyncStorage from "@react-native-community/async-storage";

const accessTokenKey = "accessToken";
const userKey = "user";
const userTypeKey = "userType";
const isAuthenticated = "isAuthenticated";
const language = "language";
const realApp = "realApp";

export const setSession = async (accessToken, user) => {
  await AsyncStorage.setItem(accessTokenKey, accessToken);
  await AsyncStorage.setItem(userKey, JSON.stringify(user));
};

export const setUser = async (user) => {
  await AsyncStorage.setItem(userKey, JSON.stringify(user));
};

export const setShowRealApp = async () => {
  await AsyncStorage.setItem(realApp, "true");
};

export const getShowRealApp = async () => {
  let showRealApp = await AsyncStorage.getItem(realApp);
  return showRealApp ? true : false;
};

export const setUserType = async (type) => {
  await AsyncStorage.setItem(userTypeKey, type);
};

export const getToken = async () => {
  let accessToken = await AsyncStorage.getItem(accessTokenKey);
  return accessToken;
};

export const clearSession = async () => {
  await AsyncStorage.removeItem(accessTokenKey);
  await AsyncStorage.removeItem(userKey);
  await AsyncStorage.removeItem(isAuthenticated);
};

export const getSession = async () => {
  let accessToken = await AsyncStorage.getItem(accessTokenKey);
  let user = JSON.parse(await AsyncStorage.getItem(userKey));
  return {
    accessToken,
    user,
  };
};

export const getSessionToken = () => {
  let token;
  if (AsyncStorage.getItem(accessTokenKey)) {
    token = AsyncStorage.getItem(accessTokenKey);
  } else {
    token = AsyncStorage.getItem(accessUserToken);
  }

  return token;
};

export const getSessionUserId = () => {
  let user = AsyncStorage.getItem(userKey);
  user = JSON.parse(user);
  return user && user.id ? user.id : null;
};

export const getUser = async () => {
  let user = JSON.parse(await AsyncStorage.getItem(userKey));
  return user;
};

export const checkSession = async () => {
  let accessToken = await AsyncStorage.getItem(accessTokenKey);
  return accessToken ? true : false;
};

export const setisAuthenticated = (state) => {
  AsyncStorage.setItem(isAuthenticated, state);
};

export const getIsAuthenticated = () => {
  let isAuthenticated = false;
  if (AsyncStorage.getItem("isAuthenticated")) {
    isAuthenticated = true;
  }
  return isAuthenticated;
};

export const setLanguage = (lang) => {
  AsyncStorage.setItem(language, lang);
};

export const getLanguage = async () => {
  return await AsyncStorage.getItem(language);
};
