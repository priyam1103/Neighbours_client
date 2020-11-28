import React, { useState,useContext } from 'react'
import axios from "axios";
import { StyleSheet, Text, TouchableOpacity, TextInput, View, Dimensions,ActivityIndicator,Keyboard,TouchableWithoutFeedback } from 'react-native'
import { AsyncStorage } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker';
import {GlobalContext} from "../context/globalState"
const screen = Dimensions.get("window");
export default function Signin({ navigation }) {
    React.useEffect(() => {
        // console.log(AsyncStorage.getItem("love_token"))
       
      navigation.addListener('focus', () => {
      setCurrentScreen("initialData")
          });
      },[])
    const { user,addUser,addToken,socketConnection,addSocket } = useContext(GlobalContext);
    const [email, setEmail] = useState();
  const [otp, setOtp] = useState();
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
  const [current_screen, setCurrentScreen] = useState("initialData")
  const [description, setDescription] = useState({
    birthday: "",
    description: "",
    likes: "",
    dislikes: "",
  })
 
    function signupUser() {
      Keyboard.dismiss;
      setLoading(true);
        setError(null)
        
        if (email != "") {
            
            const data = {
                emailId:email
            }
         
          axios.post("http://192.168.56.1:3006/user/signin", data)
            .then((res) => {
              console.log(res.data.user_)
              setLoading(false);
              addUser(res.data.user_)
              // console.log(res.data.user_)
              if (res.data.user_.description == "") {
                setCurrentScreen("description");
              }else
              setCurrentScreen("otp")
            }).catch((err) => {
              setLoading(false);
              setError(err.response.data.message)
              setTimeout(function () {
                setError()
              },4000)
          })
           // navigation.navigate("Home")
        } else {
          setLoading(false);
          setError("please enter all details")
          setTimeout(function () {
            setError()
          },4000)
        }
    
      }
    
  async function addDescription() {
    Keyboard.dismiss;
    setLoading(true);
        if (description.birthday != "" && description.description != "" && description.likes != "" && description.likes != "") {
          // console.log(user,"ckcdkl")
          await axios.post("http://192.168.56.1:3006/user/addDesc", { ...description, id: user._id })
            .then((res) => {
              setLoading(false);
          setCurrentScreen("otp")
        })
        } else {
          setLoading(false);
        setError("please enter all details")
        setTimeout(function () {
          setError()
        },4000)
      }
    }
  const verifyOtp = async () => {
    Keyboard.dismiss;
      setLoading(true);
      const data = {
        otp: otp,
        emailId:user.emailId
        }
        
     await axios.post("http://192.168.56.1:3006/user/verify", data)
         .then(async(res) => {
           //console.log(res)
           setLoading(false);
          // console.log(res.data.token)
          await addToken(res.data.token)
           const soc = await socketConnection();
      addSocket(soc);
         }).catch((err) => {
          setLoading(false);
          setError(err.response.data.message)
          setTimeout(function () {
            setError()
          },4000)
        })
        // console.log(data)
  }
  async function backToInitial() {
    setCurrentScreen("initialData");
    addUser(null);
  }
  async function backToDesc() {
    setCurrentScreen("initialData");
    addUser(null);
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
       
        {current_screen === "initialData" && (
           <View style={{ marginTop: screen.height / 5 }}>
           <Text style={{ color:"white",fontSize:40,width:"100%",textAlign:"center" }}>Neighbours</Text>
        
                  <TextInput
                    placeholder="Please enter your email id"
                            placeholderTextColor="#bfbfbf"
                            
                    
                  onChangeText={text=>setEmail(text)}
                    //  onChange={e=>setData({...data,[fields[index]]:e.target.value})}
                    style={{
                      color:"white",
                      height: 45, marginTop: 70,width:"90%", borderRadius:10,left:15,backgroundColor:"#333333", paddingLeft:20
                  
                    }}
                
            
            />
            
               <TouchableOpacity onPress={
              () => signupUser()} style={{
                marginTop: "4%",
                width: "90%", left: 15, borderRadius: 10, backgroundColor: "#004466", height: 40,textAlignVertical:"center"}}>
              {loading ? <ActivityIndicator size="small" color="white" style={{ textAlign: "center", height: 40, textAlignVertical: "center" }}/>
                :<Text style={{color:"white" ,textAlign:"center",fontSize:15,height: 40,textAlignVertical:"center"}}>Sign in</Text>
              }
              </TouchableOpacity>

         
            
            </View>)}
            {current_screen === "description" && (
           <View style={{ marginTop: 60 }}>
           <TouchableOpacity onPress={()=>{backToInitial()}}>
             <AntDesign name="arrowleft" size={34} color="white" style={{ marginLeft: 20 }} />
             </TouchableOpacity>
 
           <View style={{ marginTop: screen.height / 12,}}>
             <View style={{display:"flex",flexDirection:"row",justifyContent:"center",marginBottom:30}}>
               <Text style={{ color: "white", fontSize: 20,fontFamily:"sans-serif" }}>Tell us something about yourself</Text>
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
              () => addDescription()} style={{
                marginTop: "4%",
                width: "90%", left: 15, borderRadius: 10, backgroundColor: "#004466", height: 40,textAlignVertical:"center"}}>
              {loading ? <ActivityIndicator size="small" color="white" style={{ textAlign: "center", height: 40, textAlignVertical: "center" }}/>
                :<Text style={{color:"white" ,textAlign:"center",fontSize:15,height: 40,textAlignVertical:"center"}}>Submit</Text>
              }
              </TouchableOpacity>
          
          
          </View>
          </View>
        )}
        {current_screen === "otp" && (
          <View style={{ marginTop: 60 }}>
          
          <TouchableOpacity onPress={()=>{backToDesc()}}>
          <AntDesign name="arrowleft" size={34} color="white" style={{ marginLeft: 20 }} />
          </TouchableOpacity>
<View style={{ marginTop: screen.height / 5 }}>
           <Text style={{ color:"white",fontSize:40,width:"100%",textAlign:"center" }}>Neighbours</Text>
          <TextInput
                    placeholder={"Please enter otp"}
                placeholderTextColor="white"
                keyboardType='numeric'
                
                onChangeText={text => setOtp(text)}
                    
                    style={{
                      color:"white",
                      height: 45, marginTop: "4%",width:"90%", borderRadius:10,left:15,backgroundColor:"#333333", paddingLeft:20
                  
                    }}
                
            
              />
                   <TouchableOpacity onPress={
              () => verifyOtp()} style={{
                marginTop: "4%",
                width: "90%", left: 15, borderRadius: 10, backgroundColor: "#004466", height: 40,textAlignVertical:"center"}}>
              {loading ? <ActivityIndicator size="small" color="white" style={{ textAlign: "center", height: 40, textAlignVertical: "center" }}/>
                :<Text style={{color:"white" ,textAlign:"center",fontSize:15,height: 40,textAlignVertical:"center"}}>Submit</Text>
              }
              </TouchableOpacity>
          </View></View>)}
        
           
      
        {error &&
          <View style={{display: "flex",flexDirection:"row", justifyContent: "center", width: "100%", marginTop: "4%"}}>
          <Text style={{  color: "red" }}>{error}</Text>
            </View>}
    
        <View style={{ position: "relative", top: 40 }}>
          <View style={{
            opacity:0.2,
            width: "90%",
            left:15,
      borderBottomColor: 'white',
      borderBottomWidth: 1,
          }}></View>
          <Text style={{ color: "white", top: 5, left: "25%" }}>Don't have an account?
        <TouchableOpacity style={{top:5,marginLeft:10}} onPress={()=>navigation.navigate("Login")}>   
        <Text style={{fontWeight:"bold",color:"white",top:5,marginLeft:10}}>Sign up </Text></TouchableOpacity></Text>
        </View>
        </View>
        </TouchableWithoutFeedback>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      width: "100%",
      overflow:"scroll",
      textAlign: "center",
      height: "100%",
      
      backgroundColor:"#000000"
          
    },
  });
