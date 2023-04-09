import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:'user',
    initialState:{
        email:/*localStorage.getItem('userEmail') ||*/ null,
        isAdmin: false
    },
    reducers:{
        setUser:(state, action) => {
            state.email = action.payload.email
        },
        removeUser: state => {
            state.email = null
        }
    }
});

export const {setUser, removeUser} = userSlice.actions;

export const userReducer = userSlice.reducer;