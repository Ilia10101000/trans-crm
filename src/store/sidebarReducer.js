import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
    name:'sidebar',
    initialState:{
        isShow: false
    },
    reducers:{
        hideSidebar:(state) => {
            state.isShow = false
        },
        showSidebar:(state) => {
            state.isShow = true
        }
    }
});

export const {hideSidebar, showSidebar} = sidebarSlice.actions;
export const sidebarReducer = sidebarSlice.reducer;