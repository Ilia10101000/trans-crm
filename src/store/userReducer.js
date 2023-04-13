import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:'user',
    initialState:{
        email:null,
        name: null,
        phone:null,
        position: null
        
    },
    reducers:{
        setUser:(state, action) => {
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.phone = action.payload.phone;
            state.position = action.payload.position;
        },
        removeUser: state => {
            state.email = null;
            state.name = null;
            state.phone = null;
            state.position = null;
        }
    }
});

export const {setUser, removeUser} = userSlice.actions;

export const userReducer = userSlice.reducer;