import { createContext, useReducer } from "react";
import useAuth from "./UseAuth";


const { getUserData, getUserToken } = useAuth();

const userData = getUserData();
const token = getUserToken();


const INITIAL_STATE ={
    user: userData,
    isFecthing: false,
    error: false,
}

export const AuthContext = createContext(INITIAL_STATE);
 export const AuthContextProvider = ({children}) =>{
    const [state, dispatch] = useReducer(UseAuth, INITIAL_STATE)

    return(
        <AuthContext.Provider 
        value={{
        user:userData, 
        isFecthing:state.isFecthing, 
        error:state.error,
        dispatch,
        }}>
       {children}
        </AuthContext.Provider>
    )
 }