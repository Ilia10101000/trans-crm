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
        if(!user.id && localStorage.getItem('register-user')){
          dispatch(setUser(JSON.parse(localStorage.getItem('register-user'))))
        }
      },[]);

    React.useEffect(() => {
        if(!user.id){
            navigate('login')
        } else {
            navigate('/')
        }
    },[user.id])

    return (
        <Container fluid='md' className={isDark?'text-bg-dark':'text-bg-light'}>
                    <Sidebar/>
                <Row>
                    <Col className="d-flex flex-column min-vh-100 p-md-0">
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