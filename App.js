

import React from 'react';
import {GlobalProvider} from "./context/globalState";
import { StyleSheet, Text, TextInput,View,Button,TouchableOpacity } from 'react-native';
import Index from "./Index";
import 'localstorage-polyfill';
export default function App (){


  return (
    <GlobalProvider>
      <Index />
      </GlobalProvider>
  );
}

const styles = StyleSheet.create({});
//export default App()














