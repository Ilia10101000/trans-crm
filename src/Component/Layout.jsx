import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { Col, Container, Row } from "react-bootstrap";

export default function Layout(){

    const {email} = useSelector(state => state.user);
    const navigate = useNavigate()

    React.useEffect(() => {
        if(!email){
            navigate('login')
        }
    },[email])

    return (
        <Container>
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