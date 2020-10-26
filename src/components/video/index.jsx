/* 
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author    : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of ToXSL Technologies Pvt. Ltd. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited. 
*/

import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Permissions from "expo-permissions";

export default class Video extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      timer: "00:00",
      action: this.props.route.params.action,
    };
  }

  /**GET USER PERMISSIONS FOR VIDEO*/
  UNSAFE_componentWillMount = async () => {
    const unsubscribe = this.props.navigation.addListener("focus", (e) => {
      this.setState({ loader: true }, () => {
        this.setState({ loader: false });
      });
    });
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL,
      Permissions.AUDIO_RECORDING
    );
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
  };

  render() {
    const { loader } = this.state;
    return !loader ? (
      <VideoCamera
        action={this.state.action}
        navigation={this.props.navigation}
      />
    ) : (
        <View />
      );
  }
}

export class VideoCamera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: Camera.Constants.Type.back,
      flashMode: Camera.Constants.FlashMode.off,
      loader: false,
      recording: false,
      action: this.props.action,
    };
  }

  UNSAFE_componentWillMount = async () => {
    const unsubscribe = this.props.navigation.addListener("focus", (e) => {
      this.setState({ loader: false });
    });
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
  };

  _StopRecord = async () => {
    this.setState({ recording: false }, async () => {
      await this.camera.stopRecording();
    });
  };

  _StartRecord = async () => {
    if (this.camera) {
      this.setState({ recording: true }, async () => {
        let options = {
          quality: "480p",
          maxDuration: 120,
        };
        this.startTimer();
        let video = await this.camera.recordAsync(options);
        video.mediaType = "video";

        this.props.navigation.navigate("uploadDocuments", {
          media: video,
          action: this.state.action,
        });
      });
    }
  };

  startTimer(duration = 2) {
    var sec = 0;
    let self = this;
    setInterval(function () {
      let seconds = self.calculateTime(++sec % 60);
      let minutes = self.calculateTime(parseInt(sec / 60, 10));
      self.setState({
        timer: [minutes + ":" + seconds],
      });
    }, 1000);
  }

  calculateTime(val) {
    return val > 9 ? val : "0" + val;
  }

  toogleRecord = () => {
    const { recording } = this.state;

    if (recording) {
      this._StopRecord();
    } else {
      this._StartRecord();
    }
  };

  render() {
    const { type, flashMode, recording, timer } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Camera
          style={{ height: "70%" }}
          type={type}
          flashMode={flashMode}
          ref={(ref) => {
            this.camera = ref;
          }}
        >
          <TouchableOpacity
            style={styles.toggle}
            onPress={() =>
              this.setState({
                type:
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back,
              })
            }
          >
            <View style={styles.toggleBtn}>
              <MaterialCommunityIcons
                name="rotate-3d-variant"
                size={24}
                color="white"
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.flash]}
            onPress={() =>
              this.setState({
                flashMode:
                  flashMode === Camera.Constants.FlashMode.off
                    ? Camera.Constants.FlashMode.on
                    : flashMode === Camera.Constants.FlashMode.on
                      ? Camera.Constants.FlashMode.auto
                      : Camera.Constants.FlashMode.off,
              })
            }
          >
            <View style={styles.toggleBtn}>
              <MaterialCommunityIcons
                name={
                  flashMode === Camera.Constants.FlashMode.on
                    ? "flash"
                    : flashMode === Camera.Constants.FlashMode.off
                      ? "flash-outline"
                      : "flash-auto"
                }
                size={24}
                color="white"
              />
            </View>
          </TouchableOpacity>
        </Camera>
        <View style={styles.snapView}>
          {recording ? <BlinkingDot text="Recording" /> : <View />}
          {recording ? <Text style={styles.timer}>{timer}</Text> : <View />}
          <TouchableOpacity
            style={{ position: "absolute", top: 60 }}
            onPress={() => this.toogleRecord()}
          >
            <View style={styles.snapBtn}>
              <Text style={styles.videoBtn}>
                {recording ? "Stop" : "Start"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

class BlinkingDot extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showText: true };

    setInterval(
      () => {
        this.setState((previousState) => {
          return { showText: !previousState.showText };
        });
      },

      500
    );
  }
  render() {
    let display = this.state.showText ? this.props.text : " ";
    return (
      <Text style={{ textAlign: "center", marginTop: 10, color: "red" }}>
        {display}
      </Text>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 3,
    flexDirection: "row",
  },
  toggle: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
    bottom: 10,
    position: "absolute",
    left: 15,
  },
  flash: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
    bottom: 10,
    position: "absolute",
    right: 15,
  },
  toggleBtn: { fontSize: 18, marginBottom: 10, color: "white" },
  snapView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  snapBtn: {
    backgroundColor: "#fff",
    width: 80,
    height: 80,
    borderWidth: 8,
    borderColor: "#ccc",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  videoBtn: {
    fontSize: 20,
  },
  timer: {},
});
