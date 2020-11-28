import { AsyncStorage } from 'react-native';
export default (state, action) => {
    switch (action.type) {
        case "ADD_USER":
            // console.log(action.payload,"inactionnnnn")
        return {
          ...state,
          user: action.payload,
        };
        case "LOGOUT_USER":
            
        return {
          ...state,
          user: {},
            token: null,
            socket:null
            };
        case "UPDATE_USER": 
            // console.log(action.payload,"update")
            return {
                ...state,
                user: action.payload.user,
                token:action.payload.token
            }
        case "ADD_TOKEN": 
           
            return {
                ...state,
                token:action.payload
            }
        case "ADD_SOCKET":
          // // console.log(action.payload,"sockettt")
            return {
                ...state,
             socket:action.payload   
            }
        case "PUSH_LIKES":
            
            return {
                ...state,
                user:action.payload.user
                
                
            }
        
      default:
        return;
    }
  };