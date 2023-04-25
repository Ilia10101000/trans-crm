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
            state.changePositionList = state.changePositionList.filter(user => user.id !== action.payload)
        },
        rechangeSelectedPosition: (state,action) => {
            state.changePositionList = state.changePositionList.map(item => item.id === action.payload.id?{...item, position: action.payload.position}:item)
        },
        cleanChangeList: state => {
            state.changePositionList = [];
        }
    }
});

export const {addForChangePosition, removeFromChangePositionList, rechangeSelectedPosition, cleanChangeList} = changeUserPositionListSlice.actions;
export const changeUserPositionListReducer = changeUserPositionListSlice.reducer;