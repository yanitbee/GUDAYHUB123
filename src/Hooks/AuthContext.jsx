import { createContext, useReducer } from "react";
import UseAuth from "./UseAuth"

const INITIAL_STATE ={
    user: null,
    isFecthing: false,
    error: false,
}

export const AuthContext = createContext(INITIAL_STATE);
 export const AuthContextProvider = ({children}) =>{
    const [state, dispatch] = useReducer(UseAuth, INITIAL_STATE)

    return(
        <AuthContext.Provider 
        value={{user:state.user, 
        isFecthing:state.isFecthing, 
        error:state.error,
        dispatch,
        }}>
       {children}
        </AuthContext.Provider>
    )
 }