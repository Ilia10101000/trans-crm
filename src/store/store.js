import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./userReducer";
import { sidebarReducer } from "./sidebarReducer";
import { themeReducer } from "./themeReducer";
import { loadingReducer } from "./loadingReducer";
import { errorReducer } from "./errorReducer";
import { tripReducer} from './tripReducer'

export const store = configureStore({
    reducer:{
        trip: tripReducer,
        loading: loadingReducer,
        error: errorReducer,
        theme: themeReducer,
        sidebar: sidebarReducer,
        user: userReducer
    }
})