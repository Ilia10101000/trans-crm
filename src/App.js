import React from "react";
import {Routes, Route} from 'react-router-dom';
import Home from "./Component/Home";
import Trips from './Component/Trips';
import PageHasNotFound from './Component/PageHasNotFound';
import Layout from "./Component/Layout";
import Login from "./Component/Login";
import Register from "./Component/Register";
import Settings from "./Component/Settings";
import MyCreatedTrips from "./Component/MyCreatedTrips";
import MyReservedTrips from "./Component/MyReservedTrips";
import PersonalSetting from "./Component/PersonalSetting";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./store/userReducer";


function App() {

  const {user} = useSelector(state => state);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if(!user.email && localStorage.getItem('user')){
      dispatch(setUser(JSON.parse(localStorage.getItem('user'))))
    }
  },[])

  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>}></Route>
        <Route path="trips" element={<Trips/>}></Route>
        <Route path="createdtrips" element={<MyCreatedTrips/>}></Route>
        <Route path="reservedtrips" element={<MyReservedTrips/>}></Route>
        <Route path="personalsettings" element={<PersonalSetting/>}></Route>
        <Route path="settings" element={<Settings/>}></Route>
        <Route path="*" element={<PageHasNotFound/>}></Route>
      </Route>
        <Route path="login" element={<Login/>}></Route>
        <Route path="register" element={<Register/>}></Route>
    </Routes>
  );
}

export default App;
