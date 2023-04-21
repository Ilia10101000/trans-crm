import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./userReducer";
import { sidebarReducer } from "./sidebarReducer";
import { themeReducer } from "./themeReducer";
import { changeUserPositionListReducer } from "./changeUserPositionListReducer";

export const store = configureStore({
    reducer:{
        theme: themeReducer,
        sidebar: sidebarReducer,
        user: userReducer,
        changeUserPositionList:changeUserPositionListReducer
    }
})