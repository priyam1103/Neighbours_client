import React, { useState, useEffect } from 'react';
//import { StyleSheet, Text,Modal, View,TouchableOpacity } from 'react-native'
import axios from "axios";
import {
  Alert, Modal, StyleSheet,
  TouchableOpacity, Dimensions,
  ActivityIndicator, Image,
  SafeAreaView, TextInput,
  Platform, useWindowDimensions, Text, TouchableHighlight,Keyboard, TouchableWithoutFeedback, ScrollView, View, Button, KeyboardAvoidingView
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AsyncStorage } from 'react-native';
import { GlobalContext } from "../context/globalState"
import { Socket } from 'socket.io-client';
import { add } from 'react-native-reanimated';
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
const Home = ({ route, navigation }) => {
  const [image, setImage] = useState(null);
  const { user ,socket} = React.useContext(GlobalContext);
  // console.log(user)
  const [mood, setMood] = useState();
  const [loading, setLoading] = useState();
  const [location, setLocation] = useState();
  const [address, setAddress] = React.useState();
  const [selec_image, setSelectImage] = React.useState();
  const [haveCurrent, setHaveCurrent] = React.useState(false);
  const windowHeight = useWindowDimensions().height;
  React.useEffect(() => {
    loc()
   getCurrentProfile()
    if (route.params != undefined) {
       // console.log(route.params.image)
      const ll = route.params.image;
      setImage(ll)
    }
    navigation.addListener('focus', () => {
      getCurrentProfile()
      loc();
        });

   
  }, [route.params]);
  async function getCurrentProfile() {
    setLoading(true);
    await axios.get("http://192.168.56.1:3006/api/currentDetails", {
      headers: {
        authorization: "Bearer " + await AsyncStorage.getItem("love_token")
      }
    }).then((res) => {
   
      
    
    
      if (res.data.message === "Already have a current profile") {
        // console.log(res.data.message)
        setLoading(false);
          setMood(res.data.user.mood);
          setSelectImage(res.data.user.image);
        
        setHaveCurrent(true);
      } else if (res.data.message === "No current profile") {
        setHaveCurrent(false);
        setLoading(false);
      }
    }).catch((err) => {
      setLoading(false);
    })
  }
  async function loc() {
    let { status } = await Location.requestPermissionsAsync()

    if (status !== 'granted') {
      
      // console.log('Permission to access location was denied');
    
    } else {
      const loc = await Location.getCurrentPositionAsync();
      setLocation(loc)
      var current_location = {
        // latitude: 12.899929,
        // longitude:77.510606
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      }
      let result = await Location.reverseGeocodeAsync(current_location);
      
      setAddress(
        result[0]
      ) 
      // console.log(result[0])
     
    }
  }
  async function submit() {
    setLoading(true);
    const data = {
      mood: mood,
      reason: "",
      intrest: "",
      image: selec_image,
      address: address,
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      },
    }
    // console.log(data)
    await axios.post("http://192.168.56.1:3006/api/upload", data, {
      headers: {
        authorization: "Bearer " + await AsyncStorage.getItem("love_token")
      }
    }).then((res) => {
      setLoading(false);
      // console.log(res.data)
      navigation.navigate("FindUsers")
    }).catch((err) => {
      // console.log(err)
      setLoading(false);
    })
  }
  async function updateSubmit() {
    setLoading(true);
    loc();
    const data = {
      mood: mood,
      reason: "",
      intrest: "",
      image: selec_image,
      address: address,
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      },
    }
    socket.emit("updateLocation", data, ({ message }) => {
      if (message == "success") {
        navigation.navigate("FindUsers")
        setLoading(false);
      }
    })
    // await axios.post("http://192.168.56.1:3006/api/updateCurrentLocation", data, {
    //   headers: {
    //     authorization: "Bearer " + await AsyncStorage.getItem("love_token")
    //   }
    // }).then((res) => {
    //   // console.log(res.data)
    //   navigation.navigate("FindUsers")
    // }).catch((err)=>// console.log(err))
  }

  const discardImage = () => {
    // console.log("fnre")
    setImage(null);
    navigation.navigate("Camera")
  }
  const selectImage = () => {
    // console.log(image)
    setSelectImage(image);
    setImage(null)
  }
  return (
    
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    { image!= null ?
      <View>
        <Image source={{uri:image}} style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}></Image>
        <TouchableOpacity onPress={() => discardImage()} style={{ position: "absolute", left: 90, bottom: 180, }} >
          <Entypo name="cross" size={74} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => selectImage()} style={{ position: "absolute", left: 250, bottom: 190 }}>
          <FontAwesome name="check" size={54} color="white" />
        </TouchableOpacity>
      </View> :
      
      <KeyboardAvoidingView
        keyboardVerticalOffset={500} // adjust the value here if you need more padding
        style={{ flex: 1 }}
          
      >
        <SafeAreaView style={[{ minHeight: Math.round(windowHeight) }]}>
          
     
        
       
          <View style={styles.modalView}>
                       
          
            {selec_image == null ?
              <TouchableOpacity onPress={() => {
                 
                navigation.navigate("Camera")
          
              }}>
                <MaterialCommunityIcons name="camera-plus-outline" size={54} color="white" />
              </TouchableOpacity> :
              <TouchableOpacity onPress={() => {
                 
                navigation.navigate("Camera")
              }}>
                <Image source={{uri:`${selec_image}`}} style={{ width: 150, height: 150, borderRadius: 80 }}></Image>
              </TouchableOpacity>}
                
            <TextInput
              style={{ width: SCREEN_WIDTH / 1.5, borderColor: "white", color: "white", marginTop: 20, borderBottomWidth: 1 }}
              multiline={true}
                numberOfLines={4}
                placeholder={"About your current mood"}
                placeholderTextColor="#bfbfbf"
                disabled
                value={mood}
              onChangeText={text => setMood(text)}
            />
          
            {address ?
              <View style={{ width: 200, marginTop: 20, display: "flex", flexDirection: "row",  }}>
                <Entypo name="location-pin" size={24} color="white" />
                  <Text style={{ marginLeft: 10, fontSize: 15, width: "90%", marginTop: 2, color: "white" }}>{address.street} , {address.subregion} , {address.city} , { address.postalCode}</Text>
              </View>
                :
                <View style={{ width: 200, marginTop: 20, display: "flex", flexDirection: "row",  }}>
                  <Entypo name="location-pin" size={24} color="white" />
                  <ActivityIndicator size="small" color="white" style={{ marginLeft: 10, marginTop: 2}}/>
                 </View>
                }
              {loading ? <View>
                <ActivityIndicator size="small" color="white" style={{ marginLeft: 10, marginTop: 2}}/>
              </View> : <>
                
              {!haveCurrent ?
                <TouchableOpacity onPress={() => submit()} style={{ marginTop: 50 }}>
                  <FontAwesome5 name="location-arrow" size={34} color="white" />
                </TouchableOpacity> :
                <>
                <TouchableOpacity onPress={() => updateSubmit()} style={{ marginTop: 50 }}>
                  <Text style={{color:"white",backgroundColor:"#333333",padding:15}}>Update my current location</Text>
                  </TouchableOpacity>
                  <Text style={{color:"red",width:"80%",marginTop:20}}> * Once you update your location all of your sent and incoming requests will be reset.</Text>
                </>}</>}
              
              
               
                        
          
          </View>
     
     
     
         
            
     
     
        </SafeAreaView>
      </KeyboardAvoidingView>
       } 
          
      </TouchableWithoutFeedback>
    )
}

export default Home

const styles = StyleSheet.create({centeredView: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    paddingTop:SCREEN_HEIGHT/9,
    
    height:SCREEN_HEIGHT,
    padding: 15,
    alignItems: 'center',
    backgroundColor:"#121212"
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

