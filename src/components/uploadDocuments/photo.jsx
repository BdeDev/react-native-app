/* 
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author    : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of ToXSL Technologies Pvt. Ltd. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited. 
*/

import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Camera } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default class Photo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loader: false,
            action: this.props.route.params.action
        };
    }

    /**GET USER PERMISSIONS*/
    UNSAFE_componentWillMount = async () => {
        const unsubscribe = this.props.navigation.addListener('focus', e => {
            this.setState({ loader: true }, () => {
                this.setState({ loader: false })
            })
        });
        const { status } = await Camera.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
    }

    render() {
        const { type, flashMode, loader, refresh } = this.state
        return (
            !loader ? <PhotoCamera action={this.state.action} navigation={this.props.navigation} /> : <View />
        );
    }
}

export class PhotoCamera extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: Camera.Constants.Type.back,
            flashMode: Camera.Constants.FlashMode.off,
            loader: false,
            action: this.props.action
        };
    }

    snap = async () => {
        if (this.camera) {
            let options = {
                quality: 0.1
            }
            this.setState({ loader: true })
            let photo = await this.camera.takePictureAsync(options);
            photo.mediaType = "photo";
            this.props.navigation.navigate("uploadDocuments", { media: photo, action: this.state.action })
        }
    };

    render() {
        const { type, flashMode, loader, refresh } = this.state
        return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <Camera style={{ height: "70%" }} refresh={refresh} type={type} flashMode={flashMode} ref={ref => {
                    this.camera = ref;
                }}>

                    <TouchableOpacity
                        style={styles.toggle}
                        onPress={() =>
                            this.setState({
                                type: type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back
                            })
                        }>
                        <View style={styles.toggleBtn}>
                            <MaterialCommunityIcons name="rotate-3d-variant" size={24} color="white" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.flash]}
                        onPress={() =>
                            this.setState({
                                flashMode: flashMode === Camera.Constants.FlashMode.off
                                    ? Camera.Constants.FlashMode.on
                                    : flashMode === Camera.Constants.FlashMode.on
                                        ? Camera.Constants.FlashMode.auto :
                                        Camera.Constants.FlashMode.off
                            })
                        }>
                        <View style={styles.toggleBtn}>
                            <MaterialCommunityIcons name={flashMode === Camera.Constants.FlashMode.on ? "flash" : flashMode === Camera.Constants.FlashMode.off ? "flash-outline" : "flash-auto"} size={24} color="white" />
                        </View>
                    </TouchableOpacity>
                </Camera>
                <View
                    style={styles.snapView}>
                    {loader ? <ActivityIndicator animating={true} size={110} color="#000" /> : <View />}
                    <TouchableOpacity style={{ position: "absolute", top: 15 }} onPress={() => this.snap()}>
                        <View style={styles.snapBtn}></View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 3,
        flexDirection: 'row'
    },
    toggle: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
        bottom: 10,
        position: "absolute",
        left: 15
    },
    flash: {
        flex: 0.1,
        alignSelf: 'flex-end',
        alignItems: 'center',
        bottom: 10,
        position: "absolute",
        right: 15
    },
    toggleBtn: { fontSize: 18, marginBottom: 10, color: 'white' },
    snapView: {
        top: 50,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    snapBtn: {
        backgroundColor: '#fff',
        width: 80,
        height: 80,
        borderWidth: 8,
        borderColor: '#ccc',
        borderRadius: 50
    }
})