/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author    : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of ToXSL Technologies Pvt. Ltd. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

import * as req from "../utils/http";

export const PostReq = async (path, body) => {
  /**request for post method */
  return await req.http
    .post(path, body)
    .then((response) => {
      return response;
    })
    .catch((err) => { });
};

export const getReq = async (path) => {
  /**request for get method */
  return await req.http
    .get(path)
    .then((response) => {
      return response;
    })
    .catch((err) => { });
};

export const putReq = async (path, body) => {
  /**request for put method */
  return await req.http
    .put(path, body)
    .then((response) => {
      return response;
    })
    .catch((err) => { });
};

export const delReq = async (path, body) => {
  /**request for delete method */
  return await req.http
    .delete(path, body)
    .then((response) => {
      return response;
    })
    .catch((err) => { });
};

export const PutReq = async (path, body) => {
  /**request for put method */
  return await req.httpMultipart
    .put(path, body)
    .then((response) => {
      return response;
    })
    .catch((err) => { });
};

export const GetReq = async (path, body) => {
  /**request for put method */
  return await req.httpMultipart
    .get(path, body)
    .then((response) => {
      return response;
    })
    .catch((err) => { });
};
