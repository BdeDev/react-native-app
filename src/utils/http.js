/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author    : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of ToXSL Technologies Pvt. Ltd. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

import axios from "axios";
import URL from "../globals/config";
import * as session from "../utils/session";
import { APIBLOCK } from "../globals/constant";
import showNotification from "../services/notificationService";

/**Create a instance of axios with a custom config */
export const http = axios.create({
  baseURL: URL,
  headers: { "Content-Type": "application/json" },
});

export const httpMultipart = axios.create({
  baseURL: URL,
  // headers: { "Content-Type": "multipart/form-data" }
});

/**Add a request interceptor */
http.interceptors.request.use(
  async (config) => {
    const token = await session.getToken();
    if (token) config.headers.Authorization = token;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**Add a response interceptor */
http.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response) {
      if (401 === error.response.status) {
      } else {
        showNotification(
          "danger",
          error.response.data.message
            ? error.response.data.message
            : "some error occurs"
        );
        return error;
      }
    }
  }
);

httpMultipart.interceptors.request.use(
  async (config) => {
    const token = await session.getToken();

    if (token) config.headers.Authorization = token;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**Add a response interceptor */
httpMultipart.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response) {
      if (401 === error.response.status) {
      } else {
        showNotification(
          "danger",
          error.response.data.message
            ? error.response.data.message
            : "some error occurs"
        );
        return error;
      }
    }
  }
);
