/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/
import * as api from "../utils/requests";
import { PERPAGE } from "../globals/constant";

/* Get About Us  */
export const getUsers = async () => {
  return await api.getReq("/getUsers").then((response) => {
    return response;
  });
};
