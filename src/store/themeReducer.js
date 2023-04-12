import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
    name:'theme',
    initialState:{
        isDark: false
    },
    reducers:{
        changeThemeMode: state => {
            state.isDark = !state.isDark 
        }
    }
});

export const {changeThemeMode} = themeSlice.actions;
export const themeReducer = themeSlice.reducer;