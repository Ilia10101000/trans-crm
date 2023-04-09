import React from "react";
import {Routes, Route} from 'react-router-dom';
import Home from "./Component/Home";
import Trips from './Component/Trips';
import PageHasNotFound from './Component/PageHasNotFound';
import Layout from "./Component/Layout";
import Login from "./Component/Login";
import Register from "./Component/Register";
import Settings from "./Component/Settings";


function App() {

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
