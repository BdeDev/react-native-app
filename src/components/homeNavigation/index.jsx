/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author    : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of ToXSL Technologies Pvt. Ltd. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { DrawerContent } from "../drawer";
import Profile from "../profile";
import UserProfile from "../userProfile";
import uploadDocuments from "../uploadDocuments";
import { Icon } from "react-native-elements";
import { DrawerActions } from '@react-navigation/native';
import video from "../video";
import Photo from "../uploadDocuments/photo";

const Stack = createStackNavigator();

/**HOME SCREENS NAVIGATION*/
function HomeScreen() {
  return (
    <Stack.Navigator screenOptions={headerCommonStyle}>
      <Stack.Screen
        name="uploadDocuments"
        component={uploadDocuments}
        options={({ navigation, route }) => ({
          title: "Upload Documents",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleStyle: {
            color: "#000",
          },
          headerLeft: () => (
            <TouchableOpacity style={styles.horizontal} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
              <Icon
                name="menu"
                size={30}
                color="black"
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleStyle: {
            color: "#000",
          },
        }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTitleStyle: {
            color: "#000",
          },
        }}
      />
      <Stack.Screen
        name="Photo"
        options={{ headerShown: false }}
        component={Photo}
      />
      <Stack.Screen
        name="video"
        options={{ headerShown: false }}
        component={video}
      />
    </Stack.Navigator>
  );
}

/**DRAWER NAVIGATION*/
const Drawer = createDrawerNavigator();
export default function App() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerPosition={"left"}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
}

/**HEADER CONFIGURATION*/
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
