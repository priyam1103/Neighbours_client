import React, { createContext, useReducer } from "react"
import AppReducer from "./AppReducer"
import io from "socket.io-client";
import { AsyncStorage } from 'react-native';
const initialState = {
    user: {},
    token: null,
    socket:null
}

export const GlobalContext = createContext(initialState);

export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);
    // console.log(state)
    function addUser(user){
    dispatch({
        type: "ADD_USER",
        payload:user
    })
} 
    async function addToken(token) {
       await AsyncStorage.setItem("love_token",token)
        dispatch({
            type: "ADD_TOKEN",
            payload:token
    })
    }
    async function socketConnection() {
        const token = await AsyncStorage.getItem("love_token");
        let newSocket;
        if (token) {
            newSocket = io("http://192.168.56.1:3006/", {
                query: {
                    token: token
                }
            });

            newSocket.on("connect", () => { })
            newSocket.on("disconnect", () => { });
            
        

            return newSocket;
            
        }
    }
    async function addSocket(newSocket) {
        dispatch({
            type: "ADD_SOCKET",
            payload: newSocket
        })
    }
    async function logout() {
       await AsyncStorage.removeItem("love_token")
        dispatch({
            type: "LOGOUT_USER",
        })
    }
        function updateUser(token,user) {
            dispatch({
                type: "UPDATE_USER",
                payload: {
                    user:user,
                    token:token
                }
        })
    }
    function pushLikes(id) {
        const user_ = state.user;
        user_.outgoingConnections.push(id);
        dispatch({
            type: "PUSH_LIKES",
            payload: {
                user:user_
            }
    })
    }
    return (
        <GlobalContext.Provider
            value={{
            user: state.user,token:state.token,socket:state.socket,
                addUser,addToken,logout,updateUser,socketConnection,addSocket,pushLikes
        }}>
            {children}
        </GlobalContext.Provider>
    )
}