import { createSlice } from "@reduxjs/toolkit";

const tripSlice = createSlice({
    name:'trip',
    initialState:{
        isShowForm:false,
        driverName:null,
        car:null,
        numberOfCar:null,
        phone:null,
        departurePoint:null,
        arrivalPoint:null,
        options:null
    },
    reducers:{
        isShowCreateForm:(state, action) => {
            state.isShowForm = action.payload
        },
        cancelCreateTrip: state => {
            state.isShowForm = false;
            state.departurePoint = null;
            state.arrivalPoint = null;
            state.car = null;
            state.numberOfCar = null;
            state.options = null;
        },
        setName: (state, action) => {
            state.driverName = action.payload
        },
        setCar: (state, action) => {
            state.car = action.payload
        },
        setNumberOfCar: (state, action) => {
            state.numberOfCar = action.payload
        },
        setPhone:(state, action) => {
            state.phone = action.payload;
        },
        setDeparturePoint: (state, action) => {
            state.departurePoint = action.payload
        },
        setArrivalPoint: (state, action) => {
            state.arrivalPoint = action.payload
        },
        setOptions: (state, action) => {
            state.options = action.payload
        }
    }
});

        
export const {setDeparturePoint, setArrivalPoint, setCar, setNumberOfCar, setOptions, isShowCreateForm, cancelCreateTrip, setName, setPhone} = tripSlice.actions;
export const tripReducer = tripSlice.reducer;
