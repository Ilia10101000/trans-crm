import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { Col, Container, Row } from "react-bootstrap";
import { setUser } from "../store/userReducer";

export default function Layout(){

    const {user } = useSelector(state => state);
    const {isDark} = useSelector(state => state.theme)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        if(!user.email && localStorage.getItem('register-user')){
          dispatch(setUser(JSON.parse(localStorage.getItem('register-user'))))
        }
      },[]);

    React.useEffect(() => {
        if(!user.email){
            navigate('login')
        } else {
            navigate('/')
        }
    },[user.email])

    return (
        <Container className={isDark?'text-bg-dark':'text-bg-light'}>
                <div>
                    <Sidebar/>
                </div>
                <Row>
                    <Col className="d-flex flex-column min-vh-100">
                        <Header/>
                        <main className="flex-shrink-1 flex-grow-1">
                            <Outlet/>
                        </main>
                        <Footer/>
                    </Col>
                </Row>
        </Container>
    )
}