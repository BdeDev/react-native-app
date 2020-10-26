/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author    : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of ToXSL Technologies Pvt. Ltd. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

import { showMessage, hideMessage } from "react-native-flash-message";

/**SHOW NOTIFICATIONS*/
const showNotification = (type, message) => {
  showMessage({
    message: message === "SNR" ? "Server not responding" : message,
    type: type,
    icon: type,
    titleStyle: { fontSize: 16 },
  });
};
export default showNotification;
