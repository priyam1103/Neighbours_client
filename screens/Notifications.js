import React from 'react'
import axios from "axios";
import { AsyncStorage } from 'react-native';
import { StyleSheet, Text, View, FlatList,ActivityIndicator, Image, Button,ScrollView,TouchableOpacity } from 'react-native'
import { GlobalContext } from "../context/globalState";
import { PullView } from "react-native-pull";
const types=["request","notify"]
export default function Notifications({navigation}) {
    
    const [loading, setLoading] = React.useState(false);
    const [requests, setRequests] = React.useState([]);
    const [matchedwith, setMatchedWith] = React.useState();
    const { socket, token, user } = React.useContext(GlobalContext);
    
    const [activity, setActivity] = React.useState([]);
    React.useEffect(() => {
        socket.on("recieveNotification", (data) => {
            setActivity(data.notifications);
        })
        
        socket.on("updateRequests", (data) => {
            setRequests(data.connectionRequests);
         })
       
        navigation.addListener('focus', () => {
            fetchh()
              });
        fetchh()
    }, [])
    async function fetchh() {
        setLoading(true);
        // console.log(activity)
        await axios.get(`http://192.168.56.1:3006/api/notifications`, {
            headers: {
                authorization: "Bearer " + await AsyncStorage.getItem("love_token")
            }
        }).then((res) => {
            setLoading(false);
            setActivity(res.data.notifications);
            setRequests(res.data.connectionRequests);
             if (res.data.matched) {
                setMatchedWith(res.data.matched.with)
            }
            // console.log(res)

        }).catch((err) => {
            // console.log(err);
            setLoading(false);
        })
    }
    function getDate(d) {
        var date = new Date(d);
        return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
        
    }
   
    async function handleRefresh(resolve) {
        setTimeout(async () => {
            fetchh();

            resolve();
          }, 3000);
    }
    return (
        <PullView
            style={{
                paddingBottom: 10,
                backgroundColor: "#121212"
            }}
      onPullRelease={handleRefresh}
    >
        <View style={styles.container}>
            {requests[0] != undefined ?
                <TouchableOpacity onPress={() => navigation.navigate("connReq")}>
                    <View style={{ display: "flex", flexDirection: "row", marginLeft: 20 }}>
                       
                        
                                <Image source={{ uri: requests[0].from.image }}
                            style={{ width: 60, height: 60, borderRadius: 50 }}></Image>
                        
                        <View style={{ marginTop: 15, marginLeft: 20 }}>
                            <View style={{display:"flex",flexDirection:"row"}}>
                            <Text style={{ color: "white",backgroundColor:"red",borderRadius:50,width:30,height:20,textAlign:"center"}}>{requests.length}</Text>
                                <Text style={{ color: "white",marginLeft:10 }}>Connection Requests</Text>
                                </View>
                            <Text style={{ color: "white", opacity: 0.5 }}>Approve or ignore requests</Text>
                        </View>
                    </View>
                </TouchableOpacity> : <>{matchedwith ? <View>
                    <View style={{ display: "flex", flexDirection: "row", marginLeft: 20 }}>
                       
                        
                        <Image source={{ uri: matchedwith.image }}
                            style={{ width: 60, height: 60, borderRadius: 50 }}></Image>
                        <View style={{ marginTop: 15, marginLeft: 20 }}>
                            <Text style={{ color: "white" }}>Connected with {matchedwith.username}</Text>
                
                        </View>
                    </View>
                </View> :
                       
                        
                     
                        <View style={{ marginTop: 15}}>
                         
                            <Text style={{ color: "white", opacity: 0.5,textAlign:"center" }}>No requests yet :-(</Text>
                        
                    </View>}</>}
            <ScrollView>
                    <>
                        {loading ? <ActivityIndicator size="small" color="white" style={{ marginLeft: 10, marginTop: 20}}/> :
                            <>
                          
                                {activity.map((item, index) => {
                                    if (item.type == "requestAccepted") {
                                        return (
                                            <View style={{ marginLeft: 5, marginTop: 10 }} key={index}>
                                                <View style={{ display: "flex", flexDirection: "row" }}>
                                                    <Image source={{ uri: item.from.image }}
                                                        style={{ width: 60, height: 60, borderRadius: 50 }}></Image>
                                                    <View style={{ marginLeft: 20, marginTop: 20 }}>
                                                        <View style={{ display: "flex", flexDirection: "row" }}>
                                        
                                                            <Text style={{ fontWeight: "bold", color: "white", }}>{item.from.username}</Text>
                                                            <Text style={{ color: "white", marginLeft: 5 }}>accepted your connection request.</Text>
                                                        </View>
                              
                                                    </View>
                                
                                                </View>
                                                <View style={{ marginTop: 10, marginLeft: 25, width: "90%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                                    <Text style={{ color: "white" }}>0.5 km</Text>
                                                    <Text style={{ color: "white", marginTop: 0, marginLeft: -10 }}>
                                                        {getDate(item.timestamp)}
                                                    </Text>
                                                </View>
                            
                           
                                            </View>
                                        )
                                    } else if (item.type == "acceptRequested") {
                                        return (
                                            <View style={{ marginLeft: 5, marginTop: 10 }} key={index}>
                                                <View style={{ display: "flex", flexDirection: "row" }}>
                                                    <Image source={{ uri: item.from.image }}
                                                        style={{ width: 60, height: 60, borderRadius: 50 }}></Image>
                                                    <View style={{ marginLeft: 20, marginTop: 20 }}>
                                                        <View style={{ display: "flex", flexDirection: "row" }}>
                                                            <Text style={{ color: "white" }}>Accepted connection request of </Text>
                                                            <Text style={{ fontWeight: "bold", color: "white", marginLeft: 5 }}>{item.from.username}.</Text>
                                       
                                                        </View>
                              
                                                    </View>
                                
                                                </View>
                                                <View style={{ marginTop: 10, marginLeft: 25, width: "90%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                                    <Text style={{ color: "white" }}>0.5 km</Text>
                                                    <Text style={{ color: "white", marginTop: 0, marginLeft: -10 }}>
                                                        {getDate(item.timestamp)}
                                                    </Text>
                                                </View>
                            
                           
                                            </View>
                                        )
                                    }
                                }).reverse()
                                }
                            </>}
           </>
                </ScrollView>

        
   
            </View>
            </PullView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    
        backgroundColor: '#121212',
    },
})
