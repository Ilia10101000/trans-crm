import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:'user',
    initialState:{
        id:null,
        email:null,
        name: null,
        phone:null,
        position: null,
        signInMethod: null
        
    },
    reducers:{
        setUser:(state, action) => {
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.phone = action.payload.phone;
            state.position = action.payload.position;
            state.id = action.payload.id;
            state.signInMethod = action.payload.signInMethod;
        },
        removeUser: state => {
            state.email = null;
            state.name = null;
            state.phone = null;
            state.position = null;
            state.id = null;
            state.signInMethod = null;
        }
    }
});

export const {setUser, removeUser} = userSlice.actions;

export const userReducer = userSlice.reducer;