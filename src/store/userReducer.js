import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:'user',
    initialState:{
        email:null,
        isAdmin: false,
        name: null,
        phone:null,
        // position: null
        
    },
    reducers:{
        setUser:(state, action) => {
            state.email = action.payload.email
            state.isAdmin = action.payload.isAdmin
            state.name = action.payload.name
            state.phone = action.payload.phone
        },
        removeUser: state => {
            state.email = null;
            state.isAdmin = null;
            state.name = null;
            state.phone = null;
        }
    }
});

export const {setUser, removeUser} = userSlice.actions;

export const userReducer = userSlice.reducer;