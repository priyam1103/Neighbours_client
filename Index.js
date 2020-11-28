

import React, { useState, useRef, createRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import 'localstorage-polyfill';
import { AsyncStorage } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from "./screens/Home"
import { AntDesign } from '@expo/vector-icons';
import axios from "axios";
import { StyleSheet, Text, TextInput,View,Button,TouchableOpacity } from 'react-native';
import Signup from "./screens/Signup";

import Signin from "./screens/Signin";
import Cameraa from "./screens/Cameraa"
import MainTabScreen from "./screens/MainTabScreen"
import Description from "./screens/Description";
import { GlobalContext } from "./context/globalState";
import FindUsers from "./screens/FindUsers"
var token_;

export default function Index({navigation}) {
    const { token, addToken,updateUser,user,logout,socketConnection,addSocket } = React.useContext(GlobalContext);
  const Stack = createStackNavigator();
  const SignNaviator = createStackNavigator()

  React.useEffect(() => {
    boom();

  }, [])
  async function boom() {
    token_=await AsyncStorage.getItem("love_token");
    if (await AsyncStorage.getItem("love_token") === null){
    } else {
        addToken(await AsyncStorage.getItem("love_token"))
        check()
    }
  }
    async function check() {
      const soc = await socketConnection();
      addSocket(soc);
    
        if (token_ != null) {
            console.log("nkjnkj")
            await axios.get("http://192.168.56.1:3006/herokuapp.com/user/me", {
                  headers: {
                      authorization: "Bearer " + token_
                  }
              }).then(async(res) => {
                  
                console.log(res.data,"bgklfm")
                
              
                await updateUser(token_, res.data.user_)
               
                
              }).catch((res) => {
              // logout()
              })
          }
  }
  return (
    

      <NavigationContainer>
      {token != null ?
        
          <Stack.Navigator>
          <Stack.Screen name="Neighbours" component={MainTabScreen}  
            options={{
              headerStyle: {
                backgroundColor:"#333333"
              },
              title: "Neighbours",
              headerTitleStyle: {
                color: "#fff",
                fontFamily:"sans-serif"
              },
        
              headerRight: () => (
                <AntDesign name="logout" size={24} color="white" style={{marginRight:20}} onPress={()=>logout()}/>
              ),
            }}
/>
          </Stack.Navigator> :
          <SignNaviator.Navigator screenOptions={{headerShown:false}}>
          <SignNaviator.Screen name="Login" component={Signup} />
          <SignNaviator.Screen name="Signin" component={Signin}/>
          </SignNaviator.Navigator>}
      </NavigationContainer>
      
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow:"scroll",
    textAlign: "center",
    height: "100%",
    marginTop:"40%",
        
  },
});
//export default App()














