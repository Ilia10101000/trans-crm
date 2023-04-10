import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./userReducer";
import { sidebarReducer } from "./sidebarReducer";
import { themeReducer } from "./themeReducer";
import { loadingReducer } from "./loadingReducer";
import { errorReducer } from "./errorReducer";

export const store = configureStore({
    reducer:{
        loading: loadingReducer,
        error: errorReducer,
        theme: themeReducer,
        sidebar: sidebarReducer,
        user: userReducer
    }
})