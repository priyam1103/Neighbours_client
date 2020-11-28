import React, { useState, useEffect } from 'react';
//import { StyleSheet, Text,Modal, View,TouchableOpacity } from 'react-native'

import { Alert, Modal, StyleSheet, TouchableOpacity,Image,Dimensions, TextInput, Text, TouchableHighlight, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
const Cameraa = ({ navigation }) => {
  const [taken, setTaken] = useState(false);

  const rl = React.useRef();
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [selec_image, setSelectImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    // console.log(selec_image)
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    navigation.navigate("AddScreen");
  }
  const takePicture = async () => {
    
        const options = {quality: 1, base64: true,   aspect: [4, 3]};
    const data = await rl.current.takePictureAsync(options);
    // console.log(data);
    
      navigation.navigate("AddScreen",{image:`data:image/jpeg;base64,${data.base64}`})
    
};
  return (
      
   
       <Camera style={{ flex: 1 }} type={type} ref={rl}>
       <View
         style={{
           flex: 1,
           backgroundColor: 'transparent',
           flexDirection: 'row',
         }}>
         <TouchableOpacity
           style={{
             alignSelf: 'flex-end',
             alignItems: 'center',
             width: 100,
             marginBottom: 50,
             alignItems: "center",
             marginLeft: 50
           }}
           onPress={() => {
             setType(
               type === Camera.Constants.Type.back
                 ? Camera.Constants.Type.front
                 : Camera.Constants.Type.back
             );
           }}>
           <Ionicons name="ios-reverse-camera" size={54} color="white" />
         </TouchableOpacity>
         <TouchableOpacity
           style={{
         
             alignSelf: 'flex-end',
             alignItems: 'center',
             width: 100,
             marginBottom: 50,
             alignItems: "center",
             marginLeft: 10
             
           }}
           onPress={async () => {
             takePicture()
           }}>
           <Feather name="camera" size={54} color="white" />
           
         </TouchableOpacity>
       </View>
     </Camera>
    

    )
}

export default Cameraa

const styles = StyleSheet.create({centeredView: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
      margin: 20,
      width: "80%",
      height:"80%",
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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

