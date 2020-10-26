/* @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author    : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of ToXSL Technologies Pvt. Ltd. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited. */
import React from "react";
import ErrorMessage from "../../helper/ErrorMessage";
import showNotification from "../../services/notificationService";
import * as UserService from "../../services/userAuthServices";
import { ActivityIndicator } from "react-native-paper";
import * as session from "../../utils/session";
import { Notifications } from 'expo';
import * as Permissions from "expo-permissions";
import Constants from 'expo-constants';
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

export default class App extends React.Component {
  state = {
    email: "",
    password: "",
    errorsEmail: "",
    errorsPassword: "",
    loader: false,
  };

  /**VALIDATE LOGIN FIELDS*/
  validateFields = () => {
    const { email, password } = this.state;
    return !email
      ? { field: "Email", msg: "Please enter email" }
      : !password
        ? { field: "Password", msg: "Please enter password" }
        : password.length < 8
          ? {
            field: "Password",
            msg: "Password length must be minimum 8 character",
          }
          : true;
  };


  /**GET PERMISSIONS FOR DEVICE TOKEN*/
  componentWillMount = async () => {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = await Notifications.getExpoPushTokenAsync()
      this.setState({
        token
      })
    }
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

  }

  /**LOGIN FUNCTION*/
  login = async () => {
    const { email, password, token } = this.state;
    let validate = this.validateFields();
    if (validate !== true) {
      this.setState({ ["errors" + validate.field]: validate.msg });
      return false;
    }
    Keyboard.dismiss();
    let body = {
      email: email,
      password: password,
      deviceToken: token
    };
    this.setState({
      loader: true,
    });

    showNotification("success", "Login Successfully");
    this.props.navigation.navigate("Home");

    /**COMMNETED FOR DEMO*/
    // await UserService.login(body)
    //   .then(async (response) => {
    //     this.setState({
    //       loader: false,
    //     });
    //     if (!response) {
    //       showNotification("danger", "SNR");
    //       return false;
    //     }
    //     let responseData = response.data;
    //     if (responseData.success) {
    //       await session.setSession(responseData.token, responseData.data);
    //       showNotification("success", "Login Successfully");
    //       this.props.navigation.navigate("Navigation");
    //     } else {
    //       showNotification("danger", responseData.message);
    //     }
    //   })
    //   .catch((err) => {
    //     showNotification("danger", err);
    //     this.setState({
    //       loader: false,
    //     });
    //   });

  };
  render() {
    const { errorsEmail, errorsPassword, loader, email, password } = this.state;
    return (
      <View style={styles.container}>

        <Image
          source={require("../../../assets/icons/login.png")}
          style={styles.logo1}
        />

        <View style={[styles.inputView, errorsEmail ? styles.errorInput : ""]}>
          <TextInput
            style={styles.inputText}
            placeholder="Email"
            value={email}
            returnKeyType={"next"}
            autoCapitalize='none'
            keyboardType="email-address"
            placeholderTextColor={errorsEmail ? "red" : "#a8aab9"}
            onChangeText={(text) =>
              this.setState({ email: text, errorsEmail: "" })
            }
            onSubmitEditing={() => {
              this.passwordTextInput.focus();
            }}
            blurOnSubmit={false}
          />
        </View>
        <ErrorMessage errorValue={errorsEmail} />

        <View style={styles.inputView}>
          <TextInput
            ref={(input) => {
              this.passwordTextInput = input;
            }}
            secureTextEntry
            style={styles.inputText}
            placeholder="Password"
            value={password}
            autoCapitalize='none'
            placeholderTextColor={errorsPassword ? "red" : "#a8aab9"}
            onChangeText={(text) =>
              this.setState({ password: text, errorsPassword: "" })
            }
          />
        </View>
        <ErrorMessage errorValue={errorsPassword} />
        {loader ? (
          <ActivityIndicator
            animating={true}
            style={{ marginTop: 40, height: 60 }}
            size="large"
            color="#000"
          />
        ) : (
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => this.login()}
            >
              <Text style={styles.loginText}>Log In </Text>
            </TouchableOpacity>
          )}
        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
        <Text style={styles.text}>OR</Text>
        <TouchableOpacity>
          <Text style={styles.media}>Register as a social Media</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={styles.logo}
            source={require("../../../assets/icons/ic_fb.png")}
          />
          <Image
            style={styles.logo}
            source={require("../../../assets/icons/ic_google.png")}
          />
          <Image
            style={styles.logo}
            source={require("../../../assets/icons/ic_linkedin.png")}
          />
        </View>
        <TouchableOpacity>
          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <Text style={{ color: "#386090" }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 70
  },

  inputView: {
    width: "100%",
    borderRadius: 5,
    height: 50,
    marginBottom: 20,

    justifyContent: "center",
    padding: 20,
    borderBottomColor: "#a8aab9",
    borderBottomWidth: 1,
  },
  inputText: {
    color: "#000",
    height: 50,
    fontSize: 20,
  },
  forgot: {
    color: "#000",
    fontSize: 15,
    textAlign: "left",
    width: "100%",
  },
  media: {
    color: "#000",
    fontSize: 15,
    paddingTop: 8,
    textAlign: "left",
    width: "100%",
  },
  text: {
    paddingTop: 20,
    color: "#000",
    fontSize: 13,
    textAlign: "center",
    width: "100%",
  },
  signupText: {
    color: "#386090",
    fontSize: 13,
    paddingTop: 180,
    textAlign: "left",
    width: "100%",
  },
  loginBtn: {
    width: "90%",
    backgroundColor: "#386090",
    borderRadius: 5,

    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    fontWeight: "bold",
  },
  logo: {
    width: "30%",
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
    borderColor: "#386090",
    backgroundColor: "#386090",
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 8,
  },
  loginText: {
    color: "#fff",
    fontSize: 20,
  },
});
