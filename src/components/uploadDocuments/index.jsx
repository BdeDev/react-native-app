/* @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author    : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of ToXSL Technologies Pvt. Ltd. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited. */
import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Keyboard,
} from "react-native";
import { ListItem } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import Modal, { ModalContent, SlideAnimation } from "react-native-modals";
import * as UserService from "../../services/userAuthServices";
import showNotification from "../../services/notificationService";
import ErrorMessage from "../../helper/ErrorMessage";

export default class uploadDocuments extends React.Component {
  state = {
    licenseImg: "",
    passportImg: "",
    billImg: "",
    bodyImg: "",
    firstImg: "",
    secondImg: "",
    video: "",
    errorslicenseImg: "",
    errorspassportImg: "",
    errorsbillImg: "",
    errorsbodyImg: "",
    errorsfirstImg: "",
    errorssecondImg: "",
    errorsvideo: "",
    visible: false,
    imgSelected: false,
    licenseImgSelected: false,
    passportImgSelected: false,
    billImgSelected: false,
    firstImgSelected: false,
    bodyImgSelected: false,
  };

  list = [
    {
      title: "Driving License*",
      avatar_url:
        "https://cdn.pixabay.com/photo/2018/11/13/21/44/instagram-3814061_1280.png",
      action: "licenseImg",
      actionSelected: "licenseImgSelected",
      error: "errorslicenseImg",
    },
    {
      title: "Passport*",
      avatar_url:
        "https://cdn.pixabay.com/photo/2018/11/13/21/44/instagram-3814061_1280.png",
      action: "passportImg",
      actionSelected: "passportImgSelected",
      error: "errorspassportImg",
    },
    {
      title: "Upload Residence Bill*",
      avatar_url:
        "https://cdn.pixabay.com/photo/2018/11/13/21/44/instagram-3814061_1280.png",
      action: "billImg",
      actionSelected: "billImgSelected",
      error: "errorsbillImg",
    },
  ];

  /**GET MEDIA*/
  UNSAFE_componentWillMount = async () => {
    const unsubscribe = this.props.navigation.addListener("focus", (e) => {
      let media = this.props.route.params ? this.props.route.params.media : "";

      let action;
      if (media) {
        action = this.props.route.params.action
          ? this.props.route.params.action
          : this.state.action;
        this.setState(
          {
            [action]: media.uri,
            [action + "Selected"]: true,
            refreshing: true,
          },
          () => {
            this.setState({
              refreshing: false,
            });
          }
        );
      }
    });
  };

  validateFields = () => {
    const {
      licenseImg,
      passportImg,
      billImg,
      bodyImg,
      firstImg,
      secondImg,
      video,
    } = this.state;
    return !licenseImg
      ? { field: "licenseImg", msg: "Please upload your Driving License" }
      : !passportImg
        ? { field: "passportImg", msg: "Please upload your Passport" }
        : !billImg
          ? { field: "billImg", msg: "Please upload your Residence Bill" }
          : !firstImg
            ? { field: "firstImg", msg: "Please upload your pic" }
            : !secondImg
              ? { field: "secondImg", msg: "Please upload your pic" }
              : !bodyImg
                ? { field: "bodyImg", msg: "Please upload full body pic" }
                : !video
                  ? { field: "video", msg: "Please upload your Video" }
                  : true;
  };

  /**UPLOAD DOCUMENTS*/
  SubmitHandle = async () => {
    this.props.navigation.navigate("Home");
    let validate = this.validateFields();
    if (validate !== true) {
      this.setState(
        {
          ["errors" + validate.field]: validate.msg,
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
    let localUri1 = this.state.licenseImg;
    let filename1 = localUri1.split("/").pop();
    let match1 = /\.(\w+)$/.exec(filename1);
    let type1 = match1 ? `image/${match1[1]}` : `image`;

    let localUri2 = this.state.passportImg;
    let filename2 = localUri2.split("/").pop();
    let match2 = /\.(\w+)$/.exec(filename2);
    let type2 = match2 ? `image/${match2[1]}` : `image`;

    let localUri3 = this.state.billImg;
    let filename3 = localUri3.split("/").pop();
    let match3 = /\.(\w+)$/.exec(filename3);
    let type3 = match3 ? `image/${match3[1]}` : `image`;

    let localUri4 = this.state.firstImg;
    let filename4 = localUri4.split("/").pop();
    let match4 = /\.(\w+)$/.exec(filename4);
    let type4 = match4 ? `image/${match4[1]}` : `image`;

    let localUri5 = this.state.bodyImg;
    let filename5 = localUri5.split("/").pop();
    let match5 = /\.(\w+)$/.exec(filename5);
    let type5 = match5 ? `image/${match5[1]}` : `image`;

    let localUri6 = this.state.secondImg;
    let filename6 = localUri6.split("/").pop();
    let match6 = /\.(\w+)$/.exec(filename6);
    let type6 = match6 ? `image/${match6[1]}` : `image`;

    formData.append("licenseImg", {
      uri: localUri1,
      name: filename1,
      type: type1,
    });
    formData.append("passportImg", {
      uri: localUri2,
      name: filename2,
      type: type2,
    });
    formData.append("billImg", {
      uri: localUri3,
      name: filename3,
      type: type3,
    });
    formData.append("firstImg", {
      uri: localUri4,
      name: filename4,
      type: type4,
    });
    formData.append("bodyImg", {
      uri: localUri5,
      name: filename5,
      type: type5,
    });
    formData.append("secondImg", {
      uri: localUri6,
      name: filename6,
      type: type6,
    });

    await UserService.uploadDocuments(formData)
      .then(async (response) => {
        if (!response) {
          showNotification("danger", "SNR");
          return false;
        }
        let responseData = response.data;
        if (responseData.success) {
          showNotification("success", responseData.message);
          this.props.navigation.navigate("Home");
        } else {
          showNotification("danger", responseData.message);
        }
      })
      .catch((err) => {
        showNotification("danger", err);
      });
  };

  /**OPEN USER GALLERY FOR USER PIC*/
  openGallery = async () => {
    const { action, actionSelected } = this.state;
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
    } catch (E) {
      console.log(E);
    }
  };

  /**OPEN CAMERA*/
  openCamera = () => {
    const { action, actionSelected } = this.state;
    this.setState({ visible: false });
    this.props.navigation.navigate("Photo", { action: action });
  };

  openCamera1 = (action, actionSelected, actionerror) => {
    this.setState({
      visible: false,
      action,
      actionSelected,
      [actionerror]: "",
    });
    this.props.navigation.navigate("Photo", { action: action });
  };

  /**SELECT PHOTO*/
  selectPhoto = (type) => {
    this.setState({ visible: false });
  };

  /**RENDER ITEM*/
  renderItem = ({ item }) => (
    <View>
      <ListItem
        onPress={() =>
          this.upload(item.action, item.actionSelected, item.error)
        }
        title={item.title}
        titleStyle={styles.title}
        rightAvatar={{
          source: {
            uri: this.state[item.actionSelected]
              ? this.state[item.action]
              : item.avatar_url,
          },
          size: 40,
        }}
        bottomDivider
      />
      <ErrorMessage errorValue={this.state[item.error]} />
    </View>
  );

  /**UPLOAD DOCUMENTS*/
  upload = (action, actionSelected, actionerror) => {
    this.setState({ visible: true, action, actionSelected, [actionerror]: "" });
  };

  render() {
    const {
      firstImg,
      secondImg,
      bodyImg,
      firstImgSelected,
      bodyImgSelected,
      secondImgSelected,
      videoSelected,
      video,
      errorslicenseImg,
      errorspassportImg,
      errorsbillImg,
      errorsbodyImg,
      errorsfirstImg,
      errorssecondImg,
      errorsvideo,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View>
            <Text style={styles.docs}>Upload Documents</Text>
            <View>
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.list}
                renderItem={this.renderItem}
                refreshing={this.state.refreshing}
              />
            </View>

            <View
              style={[
                styles.textInput,
                errorsfirstImg || errorssecondImg ? styles.errorInput : "",
              ]}
            >
              <Text style={styles.docs1}>
                Your 2 picture required for verification*
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() =>
                    this.openCamera1("firstImg", "firstImgSelected")
                  }
                >
                  <Image
                    name="firstImg"
                    style={styles.logo}
                    source={
                      firstImgSelected
                        ? {
                          uri: firstImg,
                        }
                        : require("../../../assets/icons/ic_addimg.png")
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.openCamera1("secondImg", "secondImgSelected")
                  }
                >
                  <Image
                    style={styles.logo}
                    source={
                      secondImgSelected
                        ? {
                          uri: secondImg,
                        }
                        : require("../../../assets/icons/ic_addimg.png")
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
            <ErrorMessage errorValue={errorsfirstImg} />
            <View
              style={[styles.textInput, errorsbodyImg ? styles.errorInput : ""]}
            >
              <Text style={styles.docs1}>1 full body pic*</Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => this.openCamera1("bodyImg", "bodyImgSelected")}
                >
                  <Image
                    style={styles.logo}
                    source={
                      bodyImgSelected
                        ? {
                          uri: bodyImg,
                        }
                        : require("../../../assets/icons/ic_addimg.png")
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
            <ErrorMessage errorValue={errorsbodyImg} />

            <View
              style={[styles.textInput, errorsvideo ? styles.errorInput : ""]}
            >
              <Text style={styles.docs1}>Upload video*</Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({ errorsvideo: "" });
                    this.props.navigation.navigate("video", {
                      action: "video",
                      actionSelected: "videoSelected",
                    });
                  }}
                >
                  <Image
                    style={styles.logo}
                    source={
                      videoSelected
                        ? {
                          uri: video,
                        }
                        : require("../../../assets/icons/ic_addimg.png")
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
            <ErrorMessage errorValue={errorsvideo} />

            <View style={{ marginLeft: 30 }}>
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => this.SubmitHandle()}
              >
                <Text style={styles.loginText}>Save </Text>
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
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  title: {
    height: 30,
    fontSize: 15,
    color: "#6c757dd1",
  },
  docs: {
    height: 50,
    fontSize: 20,
    paddingLeft: 10,
    paddingTop: 10,
  },
  docs1: {
    height: 50,
    fontSize: 15,
    paddingLeft: 10,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  loginBtn: {
    width: "90%",
    backgroundColor: "#000",
    borderRadius: 5,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 10,
    fontWeight: "bold",
  },
  loginText: {
    color: "#fff",
    fontSize: 20,
  },
  logo: {
    paddingTop: 10,
    marginHorizontal: 5,
    height: 55,
    width: 55,
  },
  textInput: {
    marginLeft: 10,
  },
  errorInput: {
    borderBottomColor: "red",
    borderBottomWidth: 1,
  },
});
