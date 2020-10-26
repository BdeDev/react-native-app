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
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default class SignUp extends React.Component {
  state = {
    email: "",
    password: "",
  };

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="First Name"
              placeholderTextColor="#a8aab9"
              onChangeText={(text) => this.setState({ email: text })}
              onSubmitEditing={() => {
                this.passwordTextInput.focus();
              }}
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              ref={(input) => {
                this.passwordTextInput = input;
              }}
              secureTextEntry
              style={styles.inputText}
              placeholder="Last Name"
              placeholderTextColor="#a8aab9"
              onChangeText={(text) => this.setState({ password: text })}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Email"
              placeholderTextColor="#a8aab9"
              onChangeText={(text) => this.setState({ email: text })}
              onSubmitEditing={() => {
                this.passwordTextInput.focus();
              }}
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Phone Number"
              placeholderTextColor="#a8aab9"
              onChangeText={(text) => this.setState({ email: text })}
              onSubmitEditing={() => {
                this.passwordTextInput.focus();
              }}
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Age"
              placeholderTextColor="#a8aab9"
              onChangeText={(text) => this.setState({ email: text })}
              onSubmitEditing={() => {
                this.passwordTextInput.focus();
              }}
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Password"
              placeholderTextColor="#a8aab9"
              onChangeText={(text) => this.setState({ email: text })}
              onSubmitEditing={() => {
                this.passwordTextInput.focus();
              }}
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={styles.inputText}
              placeholder="Confirm Password"
              placeholderTextColor="#a8aab9"
              onChangeText={(text) => this.setState({ email: text })}
              onSubmitEditing={() => {
                this.passwordTextInput.focus();
              }}
              blurOnSubmit={false}
            />
          </View>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => this.props.navigation.navigate("Home")}
          >
            <Text style={styles.loginText}>Sign Up </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("ForgotPassword")}
          >
            <CheckBox
              value={isSelected}
              onValueChange={setSelection}
              style={styles.checkbox}
            />
            <Text style={styles.media}>Agree with terms and conditions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("SignUp")}
          >
            <Text style={styles.signupText}>
              Already have an account?{" "}
              <Text style={{ color: "#f79b2c" }}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#000",
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
    height: 40,
    fontSize: 15,
  },
  forgot: {
    color: "#fff",
    fontSize: 15,
    textAlign: "left",
    width: "100%",
  },
  media: {
    color: "#fff",
    fontSize: 12,
    paddingTop: 8,
    textAlign: "left",
    width: "100%",
  },
  signupText: {
    color: "#fff",
    fontSize: 13,
    marginTop: 30,
    textAlign: "left",
    width: "100%",
  },
  text: {
    paddingTop: 20,
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
    width: "100%",
  },
  loginBtn: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 5,

    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 10,
    fontWeight: "bold",
  },
  mediaBtn: {
    width: "30%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
    fontWeight: "bold",
    borderColor: "#fff",
    borderWidth: 1,
    marginHorizontal: 8,
  },
  loginText: {
    color: "#000",
    fontSize: 20,
  },
  mediaText: {
    color: "#fff",
    fontSize: 10,
  },
});
