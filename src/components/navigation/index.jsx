/* @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author    : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of ToXSL Technologies Pvt. Ltd. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited. */

import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import Login from "../login";
import SignUp from "../signUp";
import * as session from "../../utils/session";
const Stack = createStackNavigator();
import FlashMessage from "react-native-flash-message";
import Home from "../homeNavigation";

export default class MainNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkSession: false,
      request: 0,
    };
  }

  /**GE CURRUNT SESSION*/
  UNSAFE_componentWillMount = async () => {
    const checkSession = await session.checkSession();
    let user = await session.getSession();
    this.setState(
      {
        checkSession: checkSession,
        loaded: true,
        current_User: user.user,
      },
    );
  };

  render() {
    const { checkSession, loaded, request } = this.state;
    return (
      <NavigationContainer independent={true}>
        <Stack.Navigator screenOptions={headerCommonStyle}>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ title: "SIGN UP" }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Navigation"
            options={{ headerShown: false }}
            component={MainNavigation}
          />
        </Stack.Navigator>
        <FlashMessage position="top" />
      </NavigationContainer>
    );
  }
}

const headerCommonStyle = {
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  headerStyle: {
    backgroundColor: "#000",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#d8d5d53d",
  },
  headerTitleStyle: {
    alignSelf: "center",
    color: "#fff",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
