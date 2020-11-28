import React from 'react'
import { StyleSheet, Text, View,Image,TouchableOpacity,TextInput,ScrollView } from 'react-native'
import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { GlobalContext } from "../context/globalState";

export default function Profile({navigation}) {
    
    const { user, addUser } = React.useContext(GlobalContext);
    console.log(user)
    const [editDesc_, setEditDesc] = React.useState(false);
    const [editLikes_, setEditLikes] = React.useState(false);
    const [editDislikes_, setEditDislikes] = React.useState(false);
    const [pro, setPro] = React.useState({
        desc: user.description,
        likes: user.likes,
        dislikes: user.dislikes
    })
    React.useEffect(() => {
        navigation.addListener('focus', () => {
            fetchh()
              }); 
    },[])
    async function fetchh() {
        await axios.get("http://192.168.56.1:3006/user/me", {
            headers: {
                authorization: "Bearer " + await AsyncStorage.getItem("love_token")
            }
        }).then((res) => { 
            console.log(res.data.user_)
            addUser(res.data.user_)
        })
    }
  
    async function editDesc() {
        setEditDesc(false)
        await axios.post("http://192.168.56.1:3006/api/update/description", {data:pro.desc}, {
            headers: {
                authorization: "Bearer " + await AsyncStorage.getItem("love_token")
            }
        }).then((res) => {
            addUser(res.data.user)
        })
    }
    async function editLikes() {
        setEditLikes(false)
        await axios.post("http://192.168.56.1:3006/api/update/likes", {data:pro.likes}, {
            headers: {
                authorization: "Bearer " + await AsyncStorage.getItem("love_token")
            }
        }).then((res) => {
            
            addUser(res.data.user)
        })
    }
    async function editDislikes() {
        setEditDislikes(false)
        await axios.post("http://192.168.56.1:3006/api/update/dislikes", {data:pro.dislikes}, {
            headers: {
                authorization: "Bearer " + await AsyncStorage.getItem("love_token")
            }
        }).then((res) => {
            
            addUser(res.data.user)
        })
    }
    return (
        <View style={styles.container}>
            <View style={{ display: "flex", flexDirection: "row", marginTop: 20 }}>
                {user.image ?
                    
               <Image source={{ uri: user.image }} style={{ width: 120, height: 120, borderRadius: 70, marginLeft: 30 }}></Image>:  <TouchableOpacity onPress={() => {
                 
                navigation.navigate("Add")
          
              }}>
                <MaterialCommunityIcons name="camera-plus-outline" size={54} color="white" style={{ width: 120, borderRadius: 70, marginLeft: 1,marginTop:20 }} />
              </TouchableOpacity>    }
                <View style={{marginTop:30,marginLeft:80}}>
                    <Text style={{ color: "white", fontSize: 30, left: 25 }}>{user.connections}</Text>
                    <Text style={{ color: "white", fontSize: 13 }}>Connections</Text>
                    </View>
            </View>
            <Text style={{ color: "white", marginLeft: 40, fontSize: 15, marginTop: 15, fontWeight: "bold" }}>{user.username}</Text>
            
           
            <View style={{  marginLeft: 40, fontSize: 15, marginTop: 10 ,display:"flex",flexDirection:"row"}}>
                {editDesc_ ?
                    <>
                        <TextInput
            
                    style={{ marginLeft: 1, width: "80%", color: "white", backgroundColor: "#123212" }}
                        value={pro.desc}
                        onChangeText={text=>{setPro({...pro,"desc":text})}}
                    
                /> </>:<>
            
                    <Text style={{ color: "white", marginLeft: 1, width: "80%" }} >{user.description}</Text>
                       </>}
                
             
            </View> 
            <View style={{ marginLeft: 40, fontSize: 15, marginTop: 18, display: "flex", flexDirection: "row" }}>
                {editLikes_ ? <>
                    <TextInput 
                    style={{ marginLeft: 1, width: "80%", color: "white", backgroundColor: "#123212" }}
                    value={pro.likes}
                    onChangeText={text=>{setPro({...pro,"likes":text})}}
                         />
                    <TouchableOpacity onPress={() => editLikes()}>
                        <Feather name="check" size={28} color="white" style={{marginLeft:5}}/>
                    </TouchableOpacity>
                </> : <>
                    <AntDesign name="heart" size={24} color="#cc0000" />
                    <Text style={{ color: "white", marginLeft: 13, width: "70%" }}>{user.likes}</Text>
                <TouchableOpacity onPress={()=>{setEditLikes(true)}}>
                    <Feather name="edit-2" size={24} color="white" />
                    </TouchableOpacity></>}
                
               
            </View> 
            <View style={{  marginLeft: 40, fontSize: 15, marginTop: 18 ,display:"flex",flexDirection:"row"}}>
            {editDislikes_ ? <>
                    <TextInput 
                    style={{ marginLeft: 1, width: "80%", color: "white", backgroundColor: "#123212" }}
                    value={pro.dislikes}
                        onChangeText={text=>{setPro({...pro,"dislikes":text})}}
                     />
                    <TouchableOpacity onPress={() => editDislikes()}>
                        <Feather name="check" size={28} color="white" style={{marginLeft:5}}/>
                    </TouchableOpacity>
                </> : <>
                <Ionicons name="md-heart-dislike" size={28} color="#cc0000" />
                    <Text style={{ color: "white", marginLeft: 13, width: "70%" }}>{user.dislikes}</Text>
                <TouchableOpacity onPress={()=>{setEditDislikes(true)}}>
                    <Feather name="edit-2" size={24} color="white" />
                    </TouchableOpacity></>}
           
            </View>
      
            <ScrollView style={{ marginLeft: 30, marginTop: 30 }}>
                {user.comments && (
                    <>
                        {user.comments.map((item, index) => (
                            <View style={{ display: "flex", flexDirection: "row", marginBottom: 20 }} key={index}>
                                <Image source={{ uri: item.image }}
                                    style={{ width: 35, height: 35, borderRadius: 50 }} />
                                <Text style={{ color: "#121212", marginLeft: 10, marginTop: 5, paddingLeft: 15, padding: 5, backgroundColor: "#ff9999", borderRadius: 50, width: "80%" }}>{item.comment}</Text>
                            </View>
                        ))}
                    </>)}
             
               
            </ScrollView>
            
            
        
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        backgroundColor: '#121212',
    },
})
