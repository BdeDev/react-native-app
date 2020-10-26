/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author    : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of ToXSL Technologies Pvt. Ltd. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

import * as routes from "../helper/endpoints";
import * as api from "../utils/requests";

/**DO LOGIN*/
export const login = async (body) => {
  return await api
    .putReq(routes.userLoginRoute, body)
    .then((response) => {
      return response;
    })
    .catch((err) => { });
};

/**UPLOAD DOCUMNETS*/
export const uploadDocuments = async (body) => {
  return await api
    .PutReq(routes.userUploadDocumentsRoute, body)
    .then((response) => {
      return response;
    })
    .catch((err) => { });
};

/**UPDATE USER PROFILE*/
export const updateUserProfile = async (body) => {
  return await api
    .PutReq(routes.updateUserProfileRoute, body)
    .then((response) => {
      return response;
    })
    .catch((err) => { });
};

/**GET USER PROFILE*/
export const getUserProfile = async (body) => {
  return await api
    .GetReq(routes.getUserProfileRoute, body)
    .then((response) => {
      return response;
    })
    .catch((err) => { });
};
