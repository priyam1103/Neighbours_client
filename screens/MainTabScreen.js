import React from "react";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Notifications from "./Notifications";
import Profile from "./Profile";
import FindUsers from "./FindUsers";
import ConnectionRequests from "./ConnectionRequests";
import UserDetails from "./UserDetails";
import Cameraa from "./Cameraa";
import Description from "./Description";
import Home from "./Home";
const HomeStack = createStackNavigator();
const AddLocation = createStackNavigator();
const Notification = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (
    <Tab.Navigator initialRouteName="Home" activeColor="#fff" options={{tabBarOptions: {
        showLabel: false
        
    }}}>
        <Tab.Screen
            name="Home"
            component={HomeStackScreen}
            options={{
                tabBarLabel: 'Home',
                tabBarColor: '#121212',
                tabBarIcon: ({ color }) => (
                    <AntDesign name="home" size={24} color="#fff" />
                ),
              }}
        />
          <Tab.Screen
            name="Add"
            component={AddCurrentLocationStack}
            options={{
               tabBarLabel:"Add",
                tabBarColor: '#121212',
                tabBarIcon: ({ color }) => (
                    <AntDesign name="plus" size={24} color="#fff" />
                ),
              }}
        />
         <Tab.Screen
            name="Notification"
            component={NotificationsStack}
            options={{
                tabBarLabel: 'Notification',
                tabBarColor: '#121212',
                tabBarIcon: ({ color }) => (
                    <Ionicons name="ios-notifications-outline" size={24} color="#fff" />
                ),
              }}
        />
        <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
                tabBarLabel: 'Profile',
                tabBarColor: '#121212',
                tabBarIcon: ({ color }) => (
                    <AntDesign name="user" size={24} color="#fff" />
                ),
              }}
        />
         

    </Tab.Navigator>
)
export default MainTabScreen;

const HomeStackScreen = ({ navigation }) => (
    <HomeStack.Navigator>
        <HomeStack.Screen name="FindUsers" component={FindUsers}></HomeStack.Screen>
        <HomeStack.Screen name="UserDetails" component={UserDetails} />
        <HomeStack.Screen name="description" component={Description}/>
    </HomeStack.Navigator>
)

const AddCurrentLocationStack = ({ navigation }) => (
    <AddLocation.Navigator>
        <AddLocation.Screen name="AddScreen" component={Home}>

        </AddLocation.Screen>
        <AddLocation.Screen name="Camera" component={Cameraa}></AddLocation.Screen>

    </AddLocation.Navigator>
)

const NotificationsStack = ({ navigation }) => (
    <Notification.Navigator>
        <Notification.Screen name="Notification" component={Notifications} />
        <Notification.Screen name="connReq" component={ConnectionRequests} />
        <HomeStack.Screen name="UserDetailss" component={UserDetails}/>
    </Notification.Navigator>
)
