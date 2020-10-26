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
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import * as AdminService from "../../services/adminServices";
import showNotification from "../../services/notificationService";
import * as session from "../../utils/session";
import { Icon } from "react-native-elements";

export default class Home extends React.Component {
  state = {
    loader: false,
    userLists: [],
    request: 0,
  };

  /**GET USER LIST*/
  componentWillMount = () => {
    this.getUsers();
  };

  /**GET CURRUNT SESSION*/
  UNSAFE_componentWillMount = async () => {
    let user = await session.getSession();
    this.setState({
      current_User: user.user,
    });
  };

  /**SET RIGHT HEADER*/
  componentDidMount() {
    this.props.navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.openDrawer();
          }}
        >
          <Icon
            name="menu"
            color="#000"
            size={20}
            style={{ paddingLeft: 10 }}
          />
        </TouchableOpacity>
      ),
    });
    this.setState({
      messages: [],
    });
  }

  /**GET USER LIST*/
  getUsers = async () => {
    await AdminService.getUsers()
      .then(async (response) => {
        if (!response) {
          showNotification("danger", "SNR");
          return false;
        }
        let responseData = response.data;
        if (responseData.success) {
          this.setState({
            userLists: responseData.users,
          });
        } else {
          showNotification("danger", responseData.message);
        }
      })
      .catch((err) => {
        showNotification("danger", err);
      });
  };

  /**RENDER USER DOCUMENTS LIST*/
  renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        this.props.navigation.navigate("UserProfile", { user: item })
      }
    >
      <View>
        <View style={styles.innerCardView}>
          <View>
            <Image
              source={{
                uri:
                  "https://img.pngio.com/download-free-png-stockvader-predicted-adig-user-profile-icon-user-profile-png-880_880.png",
              }}
              style={styles.img}
            />
          </View>
          <View style={{ padding: 5 }}>
            <Text>{item.userName}</Text>
            <Text style={styles.text}>{item.email}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  render() {
    const { userLists } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {userLists.length ? (
            <FlatList
              keyExtractor={(item) => item.userName}
              data={userLists}
              renderItem={this.renderItem}
              numColumns={2}
            />
          ) : (
              <View />
            )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
  },
  innerCardView: {
    width: 150,
    height: 180,
    backgroundColor: "#fff",
    elevation: 7,
    marginBottom: 10,
    borderRadius: 12,
    marginHorizontal: 7,
    marginTop: 10,
  },
  img: {
    height: 120,
    width: 150,
  },
  text: {
    fontSize: 14,
    color: "#777",
  },
});
