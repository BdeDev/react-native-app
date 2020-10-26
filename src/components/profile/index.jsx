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
  Image,
  ImageBackground,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as session from "../../utils/session";
import { Icon, Avatar, Divider } from "react-native-elements";
import ErrorMessage from "../../helper/ErrorMessage";
import * as UserService from "../../services/userAuthServices";
import Modal, { ModalContent, SlideAnimation } from "react-native-modals";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import showNotification from "../../services/notificationService";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      errorname: "",
      about: "",
      errorabout: "",
      dob: "",
      errordob: "",
      height: "",
      errorheight: "",
      hairColor: "",
      errorhairColor: "",
      eyeColor: "",
      erroreyecolor: "",
      hobbies: "",
      errorhobbies: "",
      profilePhoto: "",
      profilePhotoSelected: "",
      errorprofilePhoto: "",
      visible: false,
      user: this.props.route.params ? this.props.route.params.user : "",
      friend: false,
    };
  }

  /**GET USER FOR DEATAILS*/
  componentDidMount() {
    this.props.navigation.setOptions({
      title: this.state.user ? this.state.user.userName : "",
    });
  }

  /**GET USER */
  UNSAFE_componentWillMount = async () => {
    let user = await session.getSession();
    this.setState(
      {
        current_User: user.user,
      },
    );
    this.getProfileDetails();
  };

  /**GET USER DEATAILS*/
  getProfileDetails = async () => {
    await UserService.getUserProfile()
      .then(async (response) => {
        if (!response) {
          showNotification("danger", "SNR");
          return false;
        }
        let responseData1 = response.data;
        let responseData = response.data.result;
        if (responseData1.success) {
          if (responseData.profilePhoto) {
            this.setState({
              profilePhoto: responseData.profilePhoto,
              profilePhotoSelected: true,
            });
          }

          this.setState({
            name: responseData.name ? responseData.name : "",
            about: responseData.about ? responseData.about : "",
            dob:
              responseData.user_id && responseData.user_id.dob
                ? responseData.user_id.dob
                : "",
            height: responseData.height ? responseData.height : "",
            hairColor: responseData.hairColor ? responseData.hairColor : "",
            eyeColor: responseData.eyeColor ? responseData.eyeColor : "",
            hobbies: responseData.hobbies ? responseData.hobbies : "",
          });
        } else {
          showNotification("danger", responseData1.message);
        }
      })
      .catch((err) => {
        showNotification("danger", err);
      });
  };

  validateFields = () => {
    const {
      name,
      about,
      dob,
      height,
      hairColor,
      eyeColor,
      hobbies,
    } = this.state;
    return !name
      ? { field: "name", msg: "Please enter your name" }
      : !about
        ? { field: "about", msg: "Please enter your about" }
        : !dob
          ? { field: "dob", msg: "Please enter your Dob" }
          : !height
            ? { field: "height", msg: "Please enter your height" }
            : !hairColor
              ? { field: "hairColor", msg: "Please enter your hair Color" }
              : !eyeColor
                ? { field: "eyeColor", msg: "Please enter your eye Color" }
                : !hobbies
                  ? { field: "hobbies", msg: "Please enter your hobbies" }
                  : true;
  };

  /**UPDATE PROFILE*/
  SubmitHandle = async () => {
    const {
      name,
      about,
      dob,
      height,
      hairColor,
      eyeColor,
      hobbies,
      profilePhoto,
      profilePhotoSelected,
    } = this.state;
    let validate = this.validateFields();
    if (validate !== true) {
      this.setState(
        {
          ["error" + validate.field]: validate.msg,
          refreshing: true,
        },
        () => {
          this.setState({
            refreshing: false,
          });
        }
      );
      return false;
    }

    const formData = new FormData();
    if (profilePhotoSelected) {
      let localUri1 = profilePhoto;
      let filename1 = localUri1.split("/").pop();
      let match1 = /\.(\w+)$/.exec(filename1);
      let type1 = match1 ? `image/${match1[1]}` : `image`;

      formData.append("profilePhoto", {
        uri: localUri1,
        name: filename1,
        type: type1,
      });
    }
    formData.append("name", name);
    formData.append("about", about);
    formData.append("dob", dob);
    formData.append("height", height);
    formData.append("hairColor", hairColor);
    formData.append("eyeColor", eyeColor);
    formData.append("hobbies", hobbies);
    await UserService.updateUserProfile(formData)
      .then(async (response) => {
        if (!response) {
          showNotification("danger", "SNR");
          return false;
        }
        let responseData = response.data;
        if (responseData.success) {
          showNotification("success", responseData.message);
        } else {
          showNotification("danger", responseData.message);
        }
      })
      .catch((err) => {
        showNotification("danger", err);
      });
  };

  /**OPEN CAMERA FOR PROFILE PIC*/
  openCamera = () => {
    const { action, actionSelected } = this.state;
    this.setState({ visible: false });
    this.props.navigation.navigate("Photo", { action: action });
  };

  /**GET PIC FROM USER GALLERY*/
  openGallery = async () => {
    const { profilePhoto, action, actionSelected } = this.state;
    this.setState({ visible: false });
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.3,
      });
      if (!result.cancelled) {
        this.setState(
          {
            [action]: result.uri,
            [actionSelected]: true,
            refreshing: true,
          },
          () => this.setState({ refreshing: false })
        );
      }
    } catch (E) { }
  };

  /**UPLOAD PIC*/
  upload = (action, actionSelected, actionerror) => {
    this.setState({
      visible: true,
      action,
      actionSelected,
      [actionerror]: "",
    });
  };

  render() {
    const {
      user,
      friend,
      name,
      errorname,
      about,
      errorabout,
      dob,
      errordob,
      height,
      errorheight,
      hairColor,
      errorhairColor,
      eyeColor,
      erroreyeColor,
      hobbies,
      errorhobbies,
      profilePhoto,
      profilePhotoSelected,
      errorprofilePhoto,
    } = this.state;

    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.inputView}>
            <ImageBackground
              style={styles.image}
              source={
                profilePhotoSelected
                  ? {
                    uri: profilePhoto,
                  }
                  : require("../../../assets/icons/ic_img3.png")
              }
              style={styles.img}
            >
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() =>
                    this.upload(
                      "profilePhoto",
                      "profilePhotoSelected",
                      "errorprofilePhoto"
                    )
                  }
                >
                  <Image
                    style={styles.img1}
                    source={
                      profilePhotoSelected
                        ? {
                          uri: profilePhoto,
                        }
                        : require("../../../assets/icons/ic_img4.png")
                    }
                  />
                  <Image
                    source={require("../../../assets/icons/ic_cam.png")}
                    style={styles.img3}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 40,
                    color: "#fff",
                    marginTop: 100,
                    marginLeft: -20,
                  }}
                >
                  {name}
                </Text>
              </View>
            </ImageBackground>
          </View>
          <TouchableOpacity
            onPress={() => this.props.navigation.openDrawer()}
          ></TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 40,
              paddingTop: 40,
            }}
          >
            <TouchableOpacity style={styles.loginBtn1}>
              <Text style={styles.text5}>Bio</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.text6}>Gallery</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 20 }}>
            <Divider style={{ backgroundColor: "#000" }} />
          </View>
          <View style={{ paddingLeft: 40, paddingRight: 40 }}>
            <View style={{ paddingTop: 10 }}>
              <Text style={styles.text2}>Name</Text>

              <View style={[errorname ? styles.errorInput : ""]}>
                <TextInput
                  style={styles.text3}
                  returnKeyType={"next"}
                  autoCapitalize="none"
                  placeholderTextColor="#a8aab9"
                  onChangeText={(text) =>
                    this.setState({ name: text, errorname: "" })
                  }
                  value={name}
                  onSubmitEditing={() => {
                    this.nameTextInput.focus();
                  }}
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <ErrorMessage errorValue={errorname} />

            <Divider style={{ backgroundColor: "#343a40ba" }} />
            <View style={{ paddingTop: 10 }}>
              <Text style={styles.text2}>About</Text>
              <View style={[errorabout ? styles.errorInput : ""]}>
                <TextInput
                  style={styles.text3}
                  returnKeyType={"next"}
                  autoCapitalize="none"
                  placeholderTextColor="#a8aab9"
                  onChangeText={(text) =>
                    this.setState({ about: text, errorabout: "" })
                  }
                  value={about}
                  onSubmitEditing={() => {
                    this.nameTextInput.focus();
                  }}
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <ErrorMessage errorValue={errorabout} />
            <Divider style={{ backgroundColor: "#343a40ba" }} />
            <View style={{ paddingTop: 10 }}>
              <Text style={styles.text2}>Date of Birth</Text>
              <View style={[errordob ? styles.errorInput : ""]}>
                <TextInput
                  style={styles.text3}
                  returnKeyType={"next"}
                  autoCapitalize="none"
                  placeholderTextColor="#a8aab9"
                  onChangeText={(text) =>
                    this.setState({ dob: text, errordob: "" })
                  }
                  value={dob}
                  onSubmitEditing={() => {
                    this.nameTextInput.focus();
                  }}
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <ErrorMessage errorValue={errordob} />
            <Divider style={{ backgroundColor: "#343a40ba" }} />
            <View style={{ paddingTop: 10 }}>
              <Text style={styles.text2}>Height</Text>
              <View
                style={[errorheight ? styles.errorInput : ""]}
              >
                <TextInput
                  style={styles.text3}
                  returnKeyType={"next"}
                  autoCapitalize="none"
                  placeholderTextColor="#a8aab9"
                  onChangeText={(text) =>
                    this.setState({ height: text, errorheight: "" })
                  }
                  value={height}
                  onSubmitEditing={() => {
                    this.nameTextInput.focus();
                  }}
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <ErrorMessage errorValue={errorheight} />

            <Divider style={{ backgroundColor: "#343a40ba" }} />
            <View style={{ paddingTop: 10 }}>
              <Text style={styles.text2}>Hair Color</Text>
              <View
                style={[errorhairColor ? styles.errorInput : ""]}
              >
                <TextInput
                  style={styles.text3}
                  returnKeyType={"next"}
                  autoCapitalize="none"
                  placeholderTextColor="#a8aab9"
                  onChangeText={(text) =>
                    this.setState({ hairColor: text, errorhairColor: "" })
                  }
                  value={hairColor}
                  onSubmitEditing={() => {
                    this.nameTextInput.focus();
                  }}
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <ErrorMessage errorValue={errorhairColor} />

            <Divider style={{ backgroundColor: "#343a40ba" }} />
            <View style={{ paddingTop: 10 }}>
              <Text style={styles.text2}>Eyes Color</Text>
              <View
                style={[erroreyeColor ? styles.errorInput : ""]}
              >
                <TextInput
                  style={styles.text3}
                  returnKeyType={"next"}
                  autoCapitalize="none"
                  placeholderTextColor="#a8aab9"
                  onChangeText={(text) =>
                    this.setState({ eyeColor: text, erroreyeColor: "" })
                  }
                  value={eyeColor}
                  onSubmitEditing={() => {
                    this.nameTextInput.focus();
                  }}
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <ErrorMessage errorValue={erroreyeColor} />

            <Divider style={{ backgroundColor: "#343a40ba" }} />
            <View style={{ paddingTop: 10 }}>
              <Text style={styles.text2}>Hobbies</Text>
              <View
                style={[errorhobbies ? styles.errorInput : ""]}
              >
                <TextInput
                  style={styles.text3}
                  returnKeyType={"next"}
                  autoCapitalize="none"
                  placeholderTextColor="#a8aab9"
                  onChangeText={(text) =>
                    this.setState({ hobbies: text, errorhobbies: "" })
                  }
                  value={hobbies}
                  onSubmitEditing={() => {
                    this.nameTextInput.focus();
                  }}
                  blurOnSubmit={false}
                />
              </View>
            </View>
          </View>
          <ErrorMessage errorValue={errorhobbies} />

          <Divider style={{ backgroundColor: "#000" }} />
          <View>
            <TouchableOpacity onPress={() => this.SubmitHandle()}>
              <Image
                source={require("../../../assets/icons/ic_edit.png")}
                style={styles.logo1}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          visible={this.state.visible}
          onTouchOutside={() => {
            this.setState({ visible: false });
          }}
          modalAnimation={
            new SlideAnimation({
              slideFrom: "bottom",
            })
          }
        >
          <ModalContent
            style={{
              backgroundColor: "#fff",
              paddingTop: 24,
              flexDirection: "row",
            }}
          >
            <TouchableOpacity onPress={() => this.openCamera()}>
              <Image
                style={styles.logo}
                source={require("../../../assets/icons/ic_camera.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.openGallery()}>
              <Image
                style={styles.logo}
                source={require("../../../assets/icons/ic_gallery.png")}
              />
            </TouchableOpacity>
          </ModalContent>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    position: "relative",
  },
  text: {
    fontSize: 20,
  },
  logo1: {
    marginLeft: 300,
    height: 70,
    width: 70,
  },
  img: {
    height: 330,
    width: 410,
    position: "relative",
  },
  img1: {
    height: 100,
    width: 100,
    marginTop: 250,
    marginLeft: 40,
    borderWidth: 2,
    borderColor: "#f79b2c",
    borderRadius: 50,
  },
  img3: {
    position: "absolute",
    marginTop: 300,
    marginLeft: 120,
  },
  text1: {
    fontSize: 20,
    paddingLeft: 30,
  },
  text2: {
    fontSize: 17,
    paddingLeft: 20,
    color: "#aaaaaa",
    paddingBottom: 0,
  },
  text5: {
    fontSize: 25,
    paddingLeft: 40,
  },
  text6: {
    fontSize: 20,
    paddingLeft: 120,
  },
  text3: {
    fontSize: 20,
    paddingLeft: 20,
    paddingBottom: 1,
  },
  loginBtn: {
    backgroundColor: "#000",
    borderRadius: 5,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,

    width: "auto",
  },
  loginBtn1: {
    borderRadius: 10,
    borderWidth: 2,
    height: 40,
    borderColor: "#343a40ba",
    width: "35%",
  },
  loginText: {
    color: "#fff",
    fontSize: 20,
  },
  errorInput: {
    borderBottomColor: "red",
    borderBottomWidth: 1,
  },
  logo: {
    paddingTop: 10,
    marginHorizontal: 5,
    height: 55,
    width: 55,
  },
});
