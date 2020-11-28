import React,{useState,useContext} from 'react'
import {
    StyleSheet,
    Text, Animated, View, Image,
    
    PanResponder, FlatList, Dimensions, ActivityIndicator,  Modal, Easing, SafeAreaView,KeyboardAvoidingView ,TouchableOpacity, TouchableHighlight,Keyboard, TouchableWithoutFeedback, Button
} from 'react-native'
import {SharedElement} from "react-native-shared-element"
import { AsyncStorage } from 'react-native';
import {GlobalContext} from "../context/globalState"
import * as Location from 'expo-location';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import axios from "axios";
import 'localstorage-polyfill';
//import Animated from 'react-native-reanimated';
import {
    FlingGestureHandler,
    Directions,
    State,
  } from 'react-native-gesture-handler';
import { Extrapolate } from 'react-native-reanimated';
import { Socket } from 'socket.io-client';
import { TextInput } from 'react-native-paper';
const { width } = Dimensions.get('screen');
const OVERFLOW_HEIGHT = 70;
const SPACING = 10;
const ITEM_WIDTH = width * 0.76;
const DOUBLE_PRESS_DELAY = 300;
var max_length = 0;

const ITEM_HEIGHT = ITEM_WIDTH * 1.7;
const VISIBLE_ITEMS = 3;
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
var inl = 0;

export default function FindUsers({route,navigation}) {
    
    const [comment, setComment] = useState();
    const [commentLoading, setCommentLoading] = useState(false);
    const [commenterror, setCommentError] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [data, setData] = useState()
    const [index, setIndex] = React.useState(0);
    const { logout, user, socketConnection, socket,addUser, addSocket, pushLikes } = useContext(GlobalContext);
    const [matchedwith, setMatchedWith] = useState();
//     // console.log(user,"finddddddd")
// // console.log(socket,"finduser")
    const [new_socket, setNewSocket] = React.useState(socket);
    React.useEffect(() => {
        
        
        navigation.addListener('focus', () => {
            fetchh()
              });
    
        if (socket != null) {
            
            socket.on("match", (data) => {
                setMatchedWith(data.matched.with);
            })
            socket.on("updateRequests", (data) => {
                addUser(data)

            })
            socket.on("getUser", (data) => {
                addUser(data)
            })
        }
       
    }, [navigation,socket])
  //  // console.log(user)
  async function fetchh() {
  
    await axios.get("http://192.168.56.1:3006/user/me", {
        headers: {
            authorization: "Bearer " + await AsyncStorage.getItem("love_token")
        }
    }).then((res) => {
        console.log(res.data.user_.incomingConnections)
        addUser(res.data.user_)
         if (res.data.user_.current_loc == null ) {
            navigation.navigate("Add");
        } else if (res.data.user_.matched) {
            setMatchedWith(res.data.user_.matched.with)
            // console.log(res.data.user_.matched.with)
            
        }
        else {
    console.log("npopoppop") 
            loc()
        }
    })
}
    async function loc() {
    //  let { status } = await Location.requestPermissionsAsync()
    //     if (status !== 'granted') {
          
    //         // console.log('Permission to access location was denied');
        
    //     } else {
    //         const loc = await Location.getCurrentPositionAsync();
    console.log("npopopkkkkp")
            var current_location = { 
                latitude: 12.899929,
                longitude:77.510606
               // latitude: loc.coords.latitude,
                //longitude: loc.coords.longitude
            }
          //  // console.log(current_location)
           //let result = await Location.reverseGeocodeAsync(current_location);
            await axios.get(`http://192.168.56.1:3006/api/nearby`,{
                headers: {
                    authorization: "Bearer " + await AsyncStorage.getItem("love_token")
                  }
            }).then((res) => {
                console.log(res.data.ne)
                
                setData(res.data.ne);
                max_length = res.data.ne.length;
                
            }).catch((err) => {
                console.log(err)
                // console.log(err)
            })
         
        //}
    }
    const scrollXIndex = React.useRef(new Animated.Value(0)).current;
    const scrollXAnimated = React.useRef(new Animated.Value(0)).current;
    const position = React.useRef(new Animated.ValueXY()).current;
    const val_op = React.useRef(new Animated.Value(0)).current;
    const val_op_text = React.useRef(new Animated.Value(0)).current;
    
const panResponder= React.useRef(PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderMove: (evt, gestureState) => {
        
        // console.log(data)
        if (gestureState.dy < -10) {
            Animated.spring(position, {
                toValue: { x: 0, y: 0 },
                friction: 4,
                useNativeDriver: true
            }).start()
          
         
        }
    position.setValue({x:gestureState.dx,y:gestureState.dy})
    },
    onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 120) {
            Animated.spring(position, {
                toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
                useNativeDriver:true
            }).start(async () => {
            
                setIndex(++inl)
                // console.log(max_length)
                //await axios.post("",)
                if (inl == max_length) {
                    loc();
                    setIndex(0)
                    inl=0
                }
                })
            }
        else if (gestureState.dx <-120) {
            Animated.spring(position, {
                toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
                useNativeDriver:true
            }).start(async () => {
                // console.log(data)
                setIndex(++inl)
                // console.log(inl)
                
                if (inl == max_length) {
                    loc();
                    setIndex(0)
                    inl=0
                }
                
                })
        } 
        
        else {
                Animated.spring(position, {
                  toValue: { x: 0, y: 0 },
                    friction: 4,
                  useNativeDriver:true
                }).start()
              }
        }
})).current;
    const setActiveIndex = React.useCallback((activeIndex) => {
        scrollXIndex.setValue(activeIndex);
        setIndex(activeIndex)
    })
    const rotateee = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: ['-10deg', '0deg', '10deg'],
        extrapolate: 'clamp'
    })
    const rotateAndTrans = { 
        transform: [{
            rotate:rotateee
        },
        ...position.getTranslateTransform()]
    }
    const likeOpacity = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp'
    })
    const dislikeOpacity = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [1,0,0],
        extrapolate: 'clamp'
   })
   const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1,0,1],
    extrapolate: 'clamp'
   })
   const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1,0.8,1],
    extrapolate: 'clamp'
   })
    var lastTap = null;
    const getSingle=(user_id) => {
        navigation.navigate("UserDetails",{details:data[index]})
    }
    const getDouble = (user_id) => {
        Animated.timing(val_op, {
            toValue: 1,
            duration: 400,
            Easing,
            useNativeDriver:true
        }).start(() => {
            // console.log(val_op)
            Animated.timing(val_op, {
                toValue: 0,
                duration: 400,
                Easing,
                useNativeDriver:true
            }).start()

            
        }) 
        const now = new Date().getTime();
        if (lastTap && (now - lastTap) <300) {
            // console.log("double press")
            
            const data = {
                id:user_id
            }
            socket.emit("sendConnection", { id: user_id }, ({ message }) => {
                if (message === "Already sent") {
             
                } else if (message == "sent") {
                    pushLikes(user_id)
                    // console.log("callback")
                  
        
                        
                    
                }
            });
      lastTap = null;
  }
  else {
            lastTap = now;
            setTimeout(function () {
                if (lastTap != null) {
                    // console.log(data[index].user,"bjwbjw")
                    navigation.navigate("UserDetails",{details:data[index]})
                }
            },400)
  }
    }

    const size = val_op.interpolate({
        inputRange: [0, 1],
        outputRange:[0,80]
    })
    React.useEffect(() => {
        position.setValue({ x: 0, y: 0 })
        
    }, [index])
    async function accpetRequest(fromId) {
        // console.log(fromId)
        socket.emit("acceptRequest", { fromId: fromId }, ({ message }) => {
            // console.log(message)
        })
    }
    async function rejectRequest(fromId) {
       
        socket.emit("rejectRequest", { ofId: fromId }, ({ message }) => {
            // console.log(message)
        })
    }
    async function endConnection(matchedId) {
        setCommentLoading(true);
        if (comment) {
        socket.emit("endConnection", {comment: comment}, ({ message }) => {
            if (message == "done") {
                fetchh();
                setCommentLoading(false);
                console.log("hgg")
                setMatchedWith();
                setComment()
                setCommentError()
                setModalVisible(false)
                
            }
        })
      
    
        
        } else {
            setCommentLoading(false);
            setCommentError("Please add a comment");
        }
    }
    async function addRating(ind) {
        for (var j = 0; j < stars.length; j++){
            if (j <= ind) {
                stars[j]=(( <TouchableHighlight onPress={() => {
                    addRating(j)
                }}>
               <AntDesign name="star" size={24} color="red" />
                </TouchableHighlight>))
            } else {
                stars[j]=( <TouchableHighlight onPress={() => {
                    addRating(j)
                }}>
                <AntDesign name="staro" size={24} color="red" />
                </TouchableHighlight>)
            }
        }
        // console.log(stars)
        setStars(stars)
        
    
        
    }
    return (
     
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
                  <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
                        <TextInput
                            placeholder={"Add a comment"}
                            onChangeText={text=>setComment(text)}
                            style={{ width: 200, height: 50, backgroundColor: "#fff" }} />
                        {commenterror && (
                            <Text style={{ color: "red", }}>{commenterror}</Text>)}
                            {commentLoading ? <ActivityIndicator size="small" color="black" style={{ marginTop: 20 }} /> :
                          <TouchableHighlight
                          style={{ ...styles.openButton, backgroundColor: "#2196F3",marginTop:20}}
                          onPress={() => {
                              endConnection()
                          }}
                        >
                          <Text style={styles.textStyle}>Submit</Text>
                        </TouchableHighlight>
                        }
          
          </View>
        </View>
      </Modal>
            {matchedwith ? 
                <View style={{marginTop:SCREEN_HEIGHT/55,justifyContent:"center"}}>
                <View style={{display:"flex",flexDirection:"row",justifyContent:'center',left:20}}>
                    <Image source={{ uri: user.image }} style={{ width: 165, height: 165, borderRadius: 100 }}></Image>
                    <Image source={{uri:matchedwith.image}} style={{width:165,height:165,borderRadius:100,left:-50}}></Image>
                    </View>
                    <View>
                        <Text style={{ textAlign: "center", color: "white", marginTop: 50, fontSize: 20 }}>Connected with <Text style={{fontWeight:"bold"}}>{matchedwith.username}</Text></Text>
                        <Text style={{ color: "white",textAlign:"center", marginTop: 10, fontSize: 20 }}>{matchedwith.mobileNo}</Text>
                        <View style={{marginTop:50,width:200,display:"flex",alignItems:"center",left:100,borderRadius:20}}>
                    <Button title="End connection"
                    backgroundColor="#333333"
                        onPress={()=>setModalVisible(!modalVisible)}
                    />
                    </View>
                       
                    </View>
                    
                </View>
            
                : <>
                        {data && user.incomingConnections!=undefined ? <>
                        {data.length > 0 ?
                
                            <View
                            >
                    
                                {
                    
                                    data.map((indexx, i) => {
                         
                                        // // console.log(indexx)
                                        if (i < index) {
                                            return null
                                        } else if (i === index) {
                                            // // console.log(indexx)
                                            // // console.log(i)
                                            // console.log(user.incomingConnections.indexOf(indexx.user.ofUser))
                                            return (
                                                <Animated.View
                                                    key={i}
                                                    {...panResponder.panHandlers}
                                                    style={
                                                        [rotateAndTrans, { height: SCREEN_HEIGHT / 1.2, width: SCREEN_WIDTH / 1.3, padding: 10, top: -SCREEN_HEIGHT / 3, left: SCREEN_WIDTH / 12, position: 'absolute' }]
                                                    }
                                                >
                                                    <Animated.View style={{ opacity: likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
                                        <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>

                                    </Animated.View>
                                    <Animated.View style={{ opacity: dislikeOpacity, transform: [{ rotate: '+30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
                                        <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>

                                    </Animated.View>
                                   
                                                    {user.incomingConnections.indexOf(indexx.user.ofUser) != -1 && !indexx.user.matched ?
                                                        <>
                                                            <View>
                                                                <TouchableWithoutFeedback onPress={() => { getSingle(indexx.user.ofUser) }} style={{}}>
                                                                    <SharedElement id={`item.${indexx.user._id}.image`}>
                                                                        <Image
                                 
                                                                            source={{ uri: `${indexx.user.image}` }} style={{
                                                                                height: SCREEN_HEIGHT / 1.5, width: SCREEN_WIDTH / 1.3, resizeMode: 'cover', borderRadius: 20
                                                                            }}
                               
                                                                        />
                                                                    </SharedElement>
                                   
                                                                </TouchableWithoutFeedback>
                                                            </View>
                                                            <>
                                           
                                                                <Animated.View style={{ opacity: 1, position: "absolute", top: "75%", left: "25%", zIndex: 5000 }}>
                                                                    <TouchableOpacity onPress={() => accpetRequest(indexx.user.ofUser)}>
                                                                        <AntDesign name="checkcircleo" size={44} color="green" />
                                                                    </TouchableOpacity>
                                                                </Animated.View>
                                              
                                           
                                                                <Animated.View style={{ opacity: 1, position: "absolute", top: "75%", right: "23%", zIndex: 5000 }}>
                                                                    <TouchableOpacity onPress={() => rejectRequest(indexx.user.ofUser)}>
                                                                        <Entypo name="circle-with-cross" size={48} color="red" />
                                                                    </TouchableOpacity>
                                                                </Animated.View>
                                              
                                                            </>
                                                        </>
                                                        :
                                                        <>{
                                                            user.outgoingConnections.indexOf(indexx.user.ofUser) != -1 && !indexx.user.matched ?
                                                                <>
                                                                    <View>
                                                                        <TouchableWithoutFeedback onPress={() => { getSingle(indexx.user.ofUser) }} style={{}}>
                                                                            <SharedElement id={`item.${indexx.user._id}.image`}>
                                                                                <Image
                                 
                                                                                    source={{ uri: `${indexx.user.image}` }} style={{
                                                                                        height: SCREEN_HEIGHT / 1.5, width: SCREEN_WIDTH / 1.3, resizeMode: 'cover', borderRadius: 20
                                                                                    }}
                               
                                                                                />
                                                                            </SharedElement>
                                   
                                                                        </TouchableWithoutFeedback>
                                                                    </View>
                                                                    <Animated.View style={{ opacity: 1, position: "absolute", top: "10%", right: "1%" }}>
                                           
                                                                        <AntDesign name="heart" size={34} color="#cc0000" style={{}} />
                                                                    </Animated.View>
                                                                </>
                                                                : <>{indexx.user.matched ? <><View>
                                                                    <TouchableWithoutFeedback >
                                                                        <SharedElement id={`item.${indexx.user._id}.image`}>
                                                                            <Image
                                         
                                                                                source={{ uri: `${indexx.user.image}` }} style={{
                                                                                    height: SCREEN_HEIGHT / 1.5, width: SCREEN_WIDTH / 1.3, resizeMode: 'cover', opacity: 0.5, borderRadius: 20
                                                                                }}
                                       
                                                                            />
                                                                        </SharedElement>
                                           
                                                                    </TouchableWithoutFeedback>
                                                                  </View>
                                                                    <Animated.View style={{ opacity: 1, position: "absolute", top: "30%", right: "22%" }}>
                                                                        <Text style={{ color: "white", fontSize: 25, opacity: 0.8 }}> Already in a match </Text>

                                                                    </Animated.View>

                                                
                                                                </> : <View>
                                                                        <TouchableWithoutFeedback onPress={() => { getDouble(indexx.user.ofUser) }} style={{}}>
                                                                            <SharedElement id={`item.${indexx.user._id}.image`}>
                                                                                <Image
                                 
                                                                                    source={{ uri: `${indexx.user.image}` }} style={{
                                                                                        height: SCREEN_HEIGHT / 1.5, width: SCREEN_WIDTH / 1.3, resizeMode: 'cover', borderRadius: 20
                                                                                    }}
                               
                                                                                />
                                                                            </SharedElement>
                                   
                                                                        </TouchableWithoutFeedback>
                                                                    </View>}</>
                                   
                                                        }</>
                                                    }
                                    
                                    
                                    
                                                    {/* {user.incomingConnections.indexOf(indexx.user.ofUser) != -1 && (
                                        <>
                                           
                                        <Animated.View style={{ opacity: 1, position: "absolute", top: "75%", left: "25%" ,zIndex:5000}}>
                                        <TouchableOpacity onPress={()=>// console.log("cnfdjk")}>
                                                    <AntDesign name="checkcircleo" size={44} color="green" />
                                                    </TouchableOpacity>
                                                </Animated.View>
                                            
                                         
                                            <Animated.View style={{ opacity: 1, position: "absolute", top: "75%", right: "23%",zIndex:5000 }}>
                                            <TouchableOpacity onPress={()=>// console.log("cnfdjk")}>
                                                    <Entypo name="circle-with-cross" size={48} color="red" />
                                                    </TouchableOpacity>
                                                </Animated.View>
                                            
                                            </>)} */}
                                                    {/* {user.outgoingConnections.indexOf(indexx.user.ofUser)!=-1 &&(
                                        <Animated.View style={{ opacity: 1, position: "absolute", top: "10%", right: "1%" }}>
                                           
                                    <AntDesign name="heart" size={34} color="#cc0000" style={{}}  />
                                    </Animated.View>)} */}
                                                    <Animated.View style={{ opacity: val_op_text, position: "absolute", top: "45%", left: "15%" }}>
                                                        <Text style={{ color: "white", fontSize: 20 }}>Connection already sent</Text>
                                                    </Animated.View>

                                                    <Animated.View style={{ opacity: val_op, position: "absolute", top: "35%", left: "45%" }}>
                                                        <AntDesign name="heart" size={54} color="white" style={{}} />
                                                    </Animated.View>
                                                    <View style={{
                                                        display: "flex", flexDirection: "row", width: SCREEN_WIDTH, justifyContent: "space-between"
                                                    }}>
                                                        <Text style={{ left: 20, top: -150, fontSize: 20, color: "white", position: "absolute", fontWeight: "bold" }}>{indexx.user.username}</Text>
                                                        <Text style={{ right: 150, top: -150, fontSize: 15, color: "white", position: "absolute" }}>{indexx.distance} km</Text>
                                                    </View>
                                                    <Text style={{ left: 20, top: -100, width: SCREEN_WIDTH - 50, fontSize: 15, color: "white" }}>{indexx.user.mood}</Text>

                                                </Animated.View>
                    
                                            )
                                        } else {
                                            // // console.log(i)
                                            return (
                                                <Animated.View
                                                    key={i}
                                                    style={
                                                        [{height: SCREEN_HEIGHT / 1.2, width: SCREEN_WIDTH / 1.3, padding: 10, top: -SCREEN_HEIGHT / 3, left: SCREEN_WIDTH / 12, position: 'absolute', opacity: nextCardOpacity, transform: [{ scale: nextCardScale }] }]
                                                    }
                                                >
                        
                                                    <View>
                                    
                                       
                                                        {user.incomingConnections.indexOf(indexx.user.ofUser) != -1 && !indexx.user.matched ?
                                                            <>
                                                                <View>
                                                                    <TouchableWithoutFeedback onPress={() => { getSingle(indexx.user.ofUser) }} style={{}}>
                                                                        <SharedElement id={`item.${indexx.user._id}.image`}>
                                                                            <Image
                                 
                                                                                source={{ uri: `${indexx.user.image}` }} style={{
                                                                                    height: SCREEN_HEIGHT / 1.5, width: SCREEN_WIDTH / 1.3, resizeMode: 'cover', borderRadius: 20
                                                                                }}
                               
                                                                            />
                                                                        </SharedElement>
                                   
                                                                    </TouchableWithoutFeedback>
                                                                </View>
                                                                <>
                                           
                                                                    <Animated.View style={{ opacity: 1, position: "absolute", top: "75%", left: "25%", zIndex: 5000 }}>
                                                                        <TouchableOpacity onPress={() => accpetRequest(indexx.user.ofUser)}>
                                                                            <AntDesign name="checkcircleo" size={44} color="green" />
                                                                        </TouchableOpacity>
                                                                    </Animated.View>
                                              
                                           
                                                                    <Animated.View style={{ opacity: 1, position: "absolute", top: "75%", right: "23%", zIndex: 5000 }}>
                                                                        <TouchableOpacity onPress={() => rejectRequest(indexx.user.ofUser)}>
                                                                            <Entypo name="circle-with-cross" size={48} color="red" />
                                                                        </TouchableOpacity>
                                                                    </Animated.View>
                                              
                                                                </>
                                                            </>
                                                            :
                                                            <>{
                                                                user.outgoingConnections.indexOf(indexx.user.ofUser) != -1 && !indexx.user.matched ?
                                                                    <>
                                                                        <View>
                                                                            <TouchableWithoutFeedback onPress={() => { getSingle(indexx.user.ofUser) }} style={{}}>
                                                                                <SharedElement id={`item.${indexx.user._id}.image`}>
                                                                                    <Image
                                 
                                                                                        source={{ uri: `${indexx.user.image}` }} style={{
                                                                                            height: SCREEN_HEIGHT / 1.5, width: SCREEN_WIDTH / 1.3, resizeMode: 'cover', borderRadius: 20
                                                                                        }}
                               
                                                                                    />
                                                                                </SharedElement>
                                   
                                                                            </TouchableWithoutFeedback>
                                                                        </View>
                                                                        <Animated.View style={{ opacity: 1, position: "absolute", top: "10%", right: "1%" }}>
                                           
                                                                            <AntDesign name="heart" size={34} color="#cc0000" style={{}} />
                                                                        </Animated.View>
                                                                    </>
                                                                    : <>{indexx.user.matched ? <><View>
                                                                        <TouchableWithoutFeedback >
                                                                            <SharedElement id={`item.${indexx.user._id}.image`}>
                                                                                <Image
                                             
                                                                                    source={{ uri: `${indexx.user.image}` }} style={{
                                                                                        height: SCREEN_HEIGHT / 1.5, width: SCREEN_WIDTH / 1.3, resizeMode: 'cover', opacity: 0.5, borderRadius: 20
                                                                                    }}
                                           
                                                                                />
                                                                            </SharedElement>
                                               
                                                                        </TouchableWithoutFeedback>
                                                                    </View>
                                                                        <Animated.View style={{ opacity: 1, position: "absolute", top: "30%", right: "22%" }}>
                                                                            <Text style={{ color: "white", fontSize: 25, opacity: 0.8 }}> Already in a match </Text>
    
                                                                        </Animated.View>
    
                                                    
                                                                    </> : <View>
                                                                            <TouchableWithoutFeedback onPress={() => { getDouble(indexx.user.ofUser) }} style={{}}>
                                                                                <SharedElement id={`item.${indexx.user._id}.image`}>
                                                                                    <Image
                                 
                                                                                        source={{ uri: `${indexx.user.image}` }} style={{
                                                                                            height: SCREEN_HEIGHT / 1.5, width: SCREEN_WIDTH / 1.3, resizeMode: 'cover', borderRadius: 20
                                                                                        }}
                               
                                                                                    />
                                                                                </SharedElement>
                                   
                                                                            </TouchableWithoutFeedback>
                                                                        </View>}</>
                                   
                                                            }</>
                                                        }
                                   
                                   
                                
                                                    </View>
                                                    <View style={{
                                                        display: "flex", flexDirection: "row", width: SCREEN_WIDTH, justifyContent: "space-between"
                                                    }}>
                                                        <Text style={{ left: 20, top: -150, fontSize: 20, color: "white", position: "absolute" }}>{indexx.user.username}</Text>
                                                        <Text style={{ right: 150, top: -150, fontSize: 15, color: "white", position: "absolute" }}>{indexx.distance} km</Text>
                                                    </View>
                                                    <Text style={{ left: 20, top: -100, width: SCREEN_WIDTH - 50, fontSize: 15, color: "white" }}>{indexx.user.mood}</Text>

                                                </Animated.View>
                                            )
                                        }
               
                                    }).reverse()
                
                                }
                            </View>
                        
                            :
                            <><View style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                <MaterialCommunityIcons name="emoticon-sad-outline" size={54} color="white" />
                            
                            </View>
                                <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", marginTop: 30 }}>
                  
                                    <Text style={{ color: "white", width: "75%", marginLeft: 20, fontSize: 20 }}>
                                        No one is available at your current location.
                                        We will notify you as soon as we get some availablility.
                     </Text>
                                </View></>}


                    </> : <ActivityIndicator size="large" color="white" />}

                    
                </>}
           
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
      </TouchableWithoutFeedback>  
    )
}

const styles = StyleSheet.create({
    ocon: {
        height: 100,
        overflow:"hidden"
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#121212',
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: -1,
      },
      location: {
        fontSize: 16,
      },
      date: {
        fontSize: 12,
      },
      itemContainer: {
        height: OVERFLOW_HEIGHT,
        padding: SPACING * 2,
      },
      itemContainerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      overflowContainer: {
        height: OVERFLOW_HEIGHT,
        overflow: 'hidden',
      },
      titleText: {
        fontSize: 14,
        lineHeight: 24,
        fontWeight: 'bold',
      },
      box: {
        height: 150,
        width: 150,
        backgroundColor: 'blue',
        borderRadius: 5,
    },

      
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        
      },
      modalView: {
          margin: 20,
          padding:50,
        backgroundColor: "white",
        borderRadius: 20,
    
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
})
