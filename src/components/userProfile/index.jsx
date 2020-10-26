/* @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author    : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of ToXSL Technologies Pvt. Ltd. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited. */
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as session from "../../utils/session";
import { Avatar } from 'react-native-elements'

export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.route.params ? this.props.route.params.user : "",
      friend: false,
    };
  }

  /**GET USER */
  componentDidMount() {
    this.props.navigation.setOptions({
      title: this.state.user ? this.state.user.userName : "",
    });
  }

  /**GET USER SESSION*/
  UNSAFE_componentWillMount = async () => {
    let user = await session.getSession();
    this.setState({
      current_User: user.user,
    })
  }

  render() {
    const { user, friend } = this.state;
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.inputView}>
            <Avatar
              rounded
              size={150}
              source={
                { uri: 'https://img.pngio.com/download-free-png-stockvader-predicted-adig-user-profile-icon-user-profile-png-880_880.png' }
              }
            />
          </View>

          <View style={{ paddingTop: 20 }}>
            <Text style={styles.text2}>User Name</Text>
            <Text style={styles.text3}>{this.state.user.userName}</Text>
          </View>
          <View style={{ paddingTop: 20 }}>
            <Text style={styles.text2}>Email Address</Text>
            <Text style={styles.text3}>{this.state.user.email}</Text>
          </View>

          <View style={{ paddingTop: 20 }}>
            <Text style={styles.text2}>Upload</Text>
            <View
              style={{
                flexDirection: "row",
                marginBottom: 10,
                paddingLeft: 20,
                paddingTop: 10,
              }}
            >
              <Image
                source={require("../../../assets/icons/ic_video.png")}
                style={styles.img}
              />
              <Image
                source={require("../../../assets/icons/ic_video.png")}
                style={styles.img}
              />
              <Image
                source={require("../../../assets/icons/ic_video_img.png")}
                style={styles.img}
              />
            </View>
          </View>
          {!friend ?
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => this.sendReq()}
            >
              <Text style={styles.loginText}>Send friend request </Text>
            </TouchableOpacity> : <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => this.props.navigation.navigate("ChatBox", { user: user })}
            >
              <Text style={styles.loginText}>Chat </Text>
            </TouchableOpacity>}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  inputView: {
    marginTop: 50,
    marginBottom: 10,
    alignItems: "center",
  },

  text: {
    fontSize: 20,
  },

  img: {
    height: 110,
    width: 110,
    marginHorizontal: 5,
  },
  text1: {
    fontSize: 20,
    paddingLeft: 20,
  },
  text2: {
    fontSize: 18,
    paddingLeft: 20,
    color: "grey",
  },
  text3: {
    fontSize: 15,
    paddingLeft: 20,
  },
  loginBtn: {
    backgroundColor: "#000",
    borderRadius: 5,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    fontWeight: "bold",
    width: "auto"
  },
  loginText: {
    color: "#fff",
    fontSize: 20,
  },
});
