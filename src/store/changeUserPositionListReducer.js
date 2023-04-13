import { createSlice } from "@reduxjs/toolkit";

const changeUserPositionListSlice = createSlice({
    name:'change users position',
    initialState:{
        changePositionList:[]
    },
    reducers:{
        addForChangePosition: (state, action) => {
            state.changePositionList.push(action.payload)
        },
        removeFromChangePositionList: (state, action) => {
            state.changePositionList = state.changePositionList.filter(user => user.email !== action.payload.email)
        },
        rechangeSelectedPosition: (state,action) => {
            state.changePositionList = state.changePositionList.map(item => item.email === action.payload.email?{...item, position: action.payload.position}:item)
        }
    }
});

export const {addForChangePosition, removeFromChangePositionList, rechangeSelectedPosition} = changeUserPositionListSlice.actions;
export const changeUserPositionListReducer = changeUserPositionListSlice.reducer;