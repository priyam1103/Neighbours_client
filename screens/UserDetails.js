import React from 'react'
import { SharedElement } from "react-native-shared-element";
import { AsyncStorage } from 'react-native';
import axios from "axios";
import {
    StyleSheet, Dimensions, Text, View, ScrollView,Image,Animated , ActivityIndicator,TouchableWithoutFeedback,SafeAreaView, FlatList, Button
} from 'react-native'
import * as Location from 'expo-location';
import * as Animatable from "react-native-animatable";
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

const fadeInBottom = {
    0: {
        opacity: 0,
        translateY:300
    },
    1: {
        opacity: 1,
        translateY:0 
        
    }
}

const DURATION = 400;
export default function UserDetails({ route, navigation }) {
  const { details } = route.params;
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState();
  const [address, setAddress] = React.useState({});
  React.useEffect(() => {

    getData();
   
  },[])

  async function getData() {
    var id_;
    setLoading(true);
    if (details.user.ofUser) {
      id_ = details.user.ofUser;
    } else {
      id_ = details.user.id;
    }
    await axios.get(`http://192.168.56.1:3006/api/userDetails/${id_}`, {
      headers: {
        authorization: "Bearer " + await AsyncStorage.getItem("love_token")
      }
    }).then(async(res) => {
      setData(res.data.user);
      // console.log(res.data.user.comments)
      
      if (res.data.user.current_loc != null) {
        const current_location = {
          latitude: res.data.user.current_loc.latitude,
          longitude: res.data.user.current_loc.longitude
        }
        let result = await Location.reverseGeocodeAsync(current_location);
        setAddress(result[0]);
        setLoading(false);
      }
    
    }).catch((err) => {
      setLoading(false);
    })
  }
    
    return (
        <View style={{flex:1}}>
        
                      
    
            <TouchableWithoutFeedback  style={{}}>
            <SharedElement id={`item.${details.user.id}.image`}>
            <Image source={{uri:details.user.image}} style={[StyleSheet.absoluteFillObject],{width:SCREEN_WIDTH,height:SCREEN_HEIGHT}} />
                </SharedElement>
                </TouchableWithoutFeedback>
            <Animatable.View 
                 
                duration={DURATION}
                delay={100}
                animation="fadeIn"
                style={[StyleSheet.absoluteFillObject, {backgroundColor:'rgba(0,0,0,0.3'}]}>

            </Animatable.View>
            <SharedElement id="general.bg" style={[StyleSheet.absoluteFillObject, {transform: [{translateY:SCREEN_HEIGHT}]}]}>
       
            <View style={[StyleSheet.absoluteFillObject, {
                backgroundColor: "#b3b3b3",
                transform: [{translateY:-SCREEN_HEIGHT*0.8}], borderRadius: 16
          }]}>
            {data && !loading ? <>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Animatable.Text
                  animation={fadeInBottom}
                  duration={DURATION}
                  delay={400}
                  style={{ fontWeight: '900', fontSize: 28, marginLeft: 20, marginTop: 20 }}>
                  {data.username}
                </Animatable.Text>
              </TouchableOpacity>
              <Animatable.Text
                animation={fadeInBottom}
                duration={DURATION}
                delay={600}
                style={{ fontWeight: '500', marginLeft: 20, marginTop: 5 }}>
                 <Text style={{fontWeight:"bold"}}> {data.connections} </Text> connections till now.
                </Animatable.Text>
              <Animatable.Text
                animation={fadeInBottom}
                duration={DURATION}
                delay={700}
                style={{ fontWeight: '500', marginLeft: 20, marginTop: 5 }}>
                <Entypo name="location-pin" size={24} color="black" /> {address.street}, {address.subregion} ,{address.city}
                </Animatable.Text>
             
              <Animatable.Text animation={fadeInBottom}
                duration={DURATION}
                delay={800}
                style={{ marginLeft: 25, marginTop: 5, fontSize: 17, marginRight: 2 }}
              >
                {data.description}
                    </Animatable.Text>
              <Animatable.View animation={fadeInBottom}
                duration={DURATION}
                delay={900}
                style={{ marginLeft: 25, marginTop: 15, fontSize: 15,display:"flex",flexDirection:"row" }} >
                <AntDesign name="heart" size={24} color="#cc0000" />
                <Text style={{ marginLeft:10  }}>{data.likes}</Text>
                    </Animatable.View>
              <Animatable.View animation={fadeInBottom}
                duration={DURATION}
                delay={900}
                style={{ marginLeft: 25, marginTop: 15, fontSize: 15 ,display:"flex",flexDirection:"row"}} >
                <Ionicons name="md-heart-dislike" size={28} color="#cc0000" />
                <Text style={{ marginLeft:10  }}>{data.dislikes}</Text>
              </Animatable.View>

              <Animatable.View animation={fadeInBottom} duration={DURATION} delay={1000} style={{ marginTop: 10, marginLeft: 20 }}>
                <Text style={{ color: "#121212" }}>Reviews from last connections :  -</Text>
                {data.comments.map((item, index) => (
                  <View style={{ display: "flex", flexDirection: "row", marginBottom: 5, }} key={index}>
                    <Text style={{
                      color: "wheat",
                      marginLeft: 10,
                      marginTop: 5,
                      paddingLeft: 15,
                      padding: 5, borderRadius: 10, backgroundColor: "#595959", width: "80%"
                    }}>{item.comment}</Text>
               </View>
                ))}
               
               

          
                </Animatable.View>
            </> :  <ActivityIndicator size="large" color="black" style={{ marginLeft: 10, marginTop: 80}}/>}
                </View>
            </SharedElement>
       
        </View>
    )
}
UserDetails.SharedElement = (route, otherRoute, showing) => {
    const { details } = route.params;
    // console.log(`item.${details.user._id}.image`)
    return [
        {
         id:`item.${details.user._id}.image`
        }, {
            id:`general.bg`
        }
    ]
}

const styles = StyleSheet.create({ container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
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
    height: 100,
    padding: 0.5* 2,
  },
  itemContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overflowContainer: {
    height: 100,
    overflow: 'hidden',
  },})
