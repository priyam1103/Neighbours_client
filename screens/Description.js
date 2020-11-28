import React,{useState} from 'react'
import { StyleSheet, Text, View,Button,TextInput,TouchableOpacity,Image } from 'react-native'
import axios from "axios";
import DatePicker from 'react-native-datepicker';
import { GlobalContext } from "../context/globalState";
import { AsyncStorage } from 'react-native';
var setX = 100;
export default function Description({navigation}) {
  const { user } = React.useContext(GlobalContext);
  
  const [description, setDescription] = useState({
    birthday: "",
    description: "",
    likes: "",
    dislikes: "",
  })
  React.useEffect(() => {
    setDescription({
      birthday: user.birthday,
      description: user.description,
      likes: user.likes,
      dislikes: user.dislikes,
    })
  },[])
    
    const updateDetails =async () => {
        await axios.post("http://192.168.56.1:3006/user/addDesc", description, {
            headers: {
                authorization: "Bearer " + await AsyncStorage.getItem("love_token")
            }
        }).then((res) => {
          //// console.log(res);
          navigation.navigate("FindUsers")
        })
    }
    return (
        <View style={styles.container}>
         
        <View>
          <View style={{display:"flex",alignItems:"center",marginTop:50}}>
            <Image source={{ uri: user.image }} style={{ width: 85, height: 85, borderRadius: 80 }}></Image>
            </View>
  
          <DatePicker
          showIcon={false}
          androidMode="spinner"
          style={{ width: "90%",color:"white" }}
          date={description.birthday}
          mode="date"
          placeholder="Birth date"
          format="DD-MM-YYYY"
         
          confirmBtnText="Chọn"
          cancelBtnText="Hủy"
          customStyles={{
            dateInput: {
color:"white",
              backgroundColor: '#333333',
          
              height: 45, marginTop: "11%",width:"90%", borderRadius:10,left:15,
              borderColor: 'black',paddingLeft:20
            },
            dateText: {
              fontSize: 14,
              color: 'white',
              
         }
          }}
          onDateChange={(date) => {
            setDescription({ ...description, "birthday": date })
          }}
        />
             <TextInput
                  placeholder={"Something about you ....."}
            placeholderTextColor="white"
              
            onChangeText={text => setDescription({ ...description, "description": text })}
            value={description.description}
                  style={{
                    color:"white",
                    height: 45, marginTop: "10%",width:"90%", borderRadius:10,left:15,backgroundColor:"#333333", paddingLeft:20
                
                  }}
              
          
          />
               <TextInput
                  placeholder={"Your likes ....."}
            placeholderTextColor="white"
              
            onChangeText={text => setDescription({ ...description, "likes": text })}
          value={description.likes}
                  style={{
                    color:"white",
                    height: 45, marginTop: "6%",width:"90%", borderRadius:10,left:15,backgroundColor:"#333333", paddingLeft:20
                
                  }}
              
          
          />
     
     <TextInput
                  placeholder={"Your Dislikes ....."}
            placeholderTextColor="white"
              
            onChangeText={text => setDescription({ ...description, "dislikes": text })}
            value={description.dislikes}
                  style={{
                    color:"white",
                    height: 45, marginTop: "6%",width:"90%", borderRadius:10,left:15,backgroundColor:"#333333", paddingLeft:20
                
                  }}
              
          
          />
          
        
          <TouchableOpacity onPress={
              ()=>updateDetails()}>

            <Text style={{width:"90%",left:15,borderRadius:10,top:20, color:"white" ,backgroundColor:"#004466",textAlign:"center",height:40,fontSize:15,textAlignVertical:"center"}}>Submit</Text>
            </TouchableOpacity> 
             
      </View>
      
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow:"scroll",
    textAlign: "center",
    height: "100%",
    
    backgroundColor:"#000000"
        
  },
})
