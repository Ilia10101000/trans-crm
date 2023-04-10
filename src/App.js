import React from "react";
import {Routes, Route} from 'react-router-dom';
import Home from "./Component/Home";
import Trips from './Component/Trips';
import PageHasNotFound from './Component/PageHasNotFound';
import Layout from "./Component/Layout";
import Login from "./Component/Login";
import Register from "./Component/Register";
import Settings from "./Component/Settings";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./store/userReducer";


function App() {

  const {user} = useSelector(state => state);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if(!user.email && localStorage.getItem('register-user')){
      dispatch(setUser(JSON.parse(localStorage.getItem('register-user'))))
    }
  },[])

  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Home/>}></Route>
        <Route path="trips" element={<Trips/>}></Route>
        <Route path="settings" element={<Settings/>}></Route>
        <Route path="*" element={<PageHasNotFound/>}></Route>
      </Route>
        <Route path="login" element={<Login/>}></Route>
        <Route path="register" element={<Register/>}></Route>
    </Routes>
  );
}

export default App;
