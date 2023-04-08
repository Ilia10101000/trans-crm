import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import { removeUser } from "../store/userReducer";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

export default function Layout(){

    const {email} = useSelector(state => state.user);
    const navigate = useNavigate()

    const dispatch = useDispatch();

    // const signOut = () => {
    //     localStorage.removeItem('userEmail')
    //     dispatch(removeUser())
    // }
    React.useEffect(() => {
        if(!email){
            navigate('login')
        }
    },[email])

    return (
        <div className="container-fluid ">
            <div className="row">
                <div className="col-2 vh-100 p-0 bg-dark text-light">
                    <Sidebar/>
                </div>
                <div className="col vh-100 bg-primary text-light">
                    <Header/>
                    <main>
                        <Outlet/>
                    </main>
                    <Footer/>
                </div>
            </div>
        </div>
    )
}