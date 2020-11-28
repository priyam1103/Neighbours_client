import React,{useContext,useState,useEffect} from 'react'
import { StyleSheet, Text, View, Image, Button,TouchableWithoutFeedback,Dimensions } from 'react-native'
import {SharedElement} from "react-native-shared-element"
import axios from "axios";
import { GlobalContext } from "../context/globalState";
import { TouchableOpacity } from 'react-native-gesture-handler';
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
export default function ConnectionRequests({navigation}) {
    const { socket, token } = React.useContext(GlobalContext);
    const [requests, setRequests] = useState([]);
    // console.log("rgner")
    useEffect(() => {
        socket.emit("myRequests",{} ,({ data_ }) => {
            setRequests(data_.connectionRequests);
        }) 
        socket.on("updateRequests", (data) => {
            setRequests(data.connectionRequests);
        })
        
    }, [])
    function getDate(d) {
        var date = new Date(d);
        return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
        
    }
    async function accpetRequest(fromId) {
        // console.log(fromId)
        socket.emit("acceptRequest", { fromId: fromId }, ({ message }) => {
            if (message == "done") {
                navigation.navigate("Home")
            }
        })
    }
    async function rejectRequest(fromId) {
        socket.emit("rejectRequest", { ofId: fromId }, ({ message }) => {
            // console.log(message)
        })
    }
    async function getSingle(index) {
        navigation.navigate("UserDetailss",{details:{user:requests[index].from}})
        
    }
    return (
        <View style={styles.container}>
            
            {requests.map((item, index) => {
                 // console.log(item,"cfbj")
                    return (
                        <View style={{marginLeft:5,marginTop:10,width:"100%"}} key={index}>
                            <View style={{ display: "flex", flexDirection: "row" ,justifyContent:"space-between"}}>
                                <View style={{ display: "flex", flexDirection: "row" }}>
                                <TouchableWithoutFeedback onPress={() => { getSingle(index)}} style={{}}>
                                                <SharedElement id={item.from.image}>
                                            
                                    <Image source={{ uri: item.from.image }}
                                style={{ width: 50, height: 50, borderRadius: 50 }}></Image></SharedElement></TouchableWithoutFeedback>
                            <View style={{marginLeft:20,marginTop:1}}>
                                    <View style={{ display: "flex", flexDirection: "row"}}>
                                        
                                        <Text style={{ fontWeight: "bold", color: "white", marginLeft: 5 }}>{item.from.username}.</Text>
                                    </View>
                                    <Text style={{ color: "white", marginTop:2 }}>{item.from.current_mood}.</Text>
                              
                                    </View>
                                    </View>
                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginRight: 10,marginTop:10 }}>
                                    
                                    <TouchableOpacity onPress={()=>accpetRequest(item.from.id)}>
                                        <Text style={{backgroundColor:"#405DE6",textAlign:"center",color:"white",width:80,height:30,textAlignVertical:"center",borderRadius:5,marginRight:10}}>Accept</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>rejectRequest(item.from.id)}>
                                        <Text style={{backgroundColor:"#000000",textAlign:"center",color:"white",width:80,height:30,textAlignVertical:"center",borderColor:"white",borderWidth:1,borderRadius:5}}>Reject</Text>
                                    </TouchableOpacity>
                   
                   
            </View>
                            </View>
                            <View style={{marginTop:10,marginLeft:5,width:"90%", display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                                <Text style={{ color: "white" }}>0.5 km</Text>
                                
                             
                            </View>
                            
                            
                           
                            </View>
                    )
                
            }).reverse()
                }
 <SharedElement id="general.bg" style={[StyleSheet.absoluteFillObject, {transform: [{translateY:SCREEN_HEIGHT}]}]}>
            <View
                style={[StyleSheet.absoluteFillObject,
                    {
                        backgroundColor: "#fff",
                
                        transform: [{translateY:SCREEN_HEIGHT}],
                        borderRadius: 16
                        }]}></View>
                </SharedElement>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    
        backgroundColor: '#121212',
    },
})
