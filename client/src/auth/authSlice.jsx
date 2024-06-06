import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token:localStorage.getItem("token")||"",
        isUserLoggedIn: localStorage.getItem("token")? true: false,
        userFullName: ""
    },
    reducers:{
        setToken:(state, action)=>{
            const token = action.payload.token
            state.token = token
            state.isUserLoggedIn = true
            localStorage.setItem("token", token)
            const user = action.payload.user
            state.user = user
            localStorage.setItem("user",JSON.stringify(user) )
         
        },
        removeToken: (state, action)=>{
            state.token = ""
            state.isUserLoggedIn = false
            localStorage.removeItem("token")
        }
    }

})

export default authSlice.reducer
export const {setToken, removeToken}=authSlice.actions
export const selectToken = (state)=>state.auth.token