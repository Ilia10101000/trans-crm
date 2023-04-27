import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
    name:'theme',
    initialState:{
        isDark: false
    },
    reducers:{
        changeThemeMode: state => {
            state.isDark = !state.isDark 
        },
        setThemeMode:(state,action) => {
            state.isDark = action.payload
        }
    }
});

export const {changeThemeMode, setThemeMode} = themeSlice.actions;
export const themeReducer = themeSlice.reducer;