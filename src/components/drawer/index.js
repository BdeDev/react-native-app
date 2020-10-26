/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author    : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of ToXSL Technologies Pvt. Ltd. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

import React, { Component } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { DrawerItem, DrawerContentScrollView } from "@react-navigation/drawer";
import { Avatar, Drawer } from "react-native-paper";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableHighlight } from "react-native-gesture-handler";
import * as session from "../../utils/session";
import { UserAvatar } from "../../helper/constant";

export class DrawerContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      image: UserAvatar,
    };
  }

  /**FUNTION FOR LOGOUT CONFIRMATION*/
  createTwoButtonAlert = () =>
    Alert.alert(
      "Confirm",
      " Are you Sure want to Logout ?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => this.confirmLogout() },
      ],
      { cancelable: false }
    );

  /**FUNTION FOR LOGOUT */
  confirmLogout = async () => {
    await session.clearSession();
    this.props.navigation.navigate("Navigation");
  };

  /**GET CURRENT SESSION*/
  UNSAFE_componentWillMount = async () => {
    let user = await session.getSession();
    this.setState({
      user: user.user,
    });
  };

  render() {
    const { user, image } = this.state;
    return (
      <DrawerContentScrollView>
        <View style={styles.drawerContent}>
          <View style={styles.closeBtn}>
            <TouchableHighlight
              onPress={() => this.props.navigation.closeDrawer()}
            >
              <AntDesign name="closecircleo" size={24} color="white" />
            </TouchableHighlight>
          </View>
          <View
            style={styles.profileBck}
          >
            <Avatar.Image
              source={{
                uri:
                  "https://img.pngio.com/download-free-png-stockvader-predicted-adig-user-profile-icon-user-profile-png-880_880.png",
              }}
              size={100}
              style={{ top: 30 }}
            />
            <Text style={styles.title}>Tom</Text>

            <TouchableHighlight
              onPress={() => this.props.navigation.navigate("Profile")}
            >
              <Text style={styles.profileText}>View Profile</Text>
            </TouchableHighlight>
          </View>
          <Drawer.Section>
            <DrawerItem
              icon={({ color, size }) => (
                <MaterialCommunityIcons
                  name="logout"
                  color={color}
                  size={size}
                />
              )}
              label={"Logout"}
              onPress={() => this.createTwoButtonAlert()}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
    );
  }
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  profileText: {
    color: "#3c80ea",
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: "#3c80ea",
    fontSize: 15,
    marginBottom: 20,
  },
  closeBtn: {
    zIndex: 999,
    position: "absolute",
    top: -10,
    marginLeft: 5,
  },
  title: {
    marginTop: 40,
    color: "#fff",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 5,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  labelStyle: {
    color: "black",
    fontSize: 15,
  },
  profileBck: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    top: -30,
  }
});
