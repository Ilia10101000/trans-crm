import React from "react";
import { useSelector} from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { Col, Container, Row } from "react-bootstrap";

export default function Layout(){

    const {user } = useSelector(state => state);
    const {isDark} = useSelector(state => state.theme)
    const navigate = useNavigate();

    React.useEffect(() => {
        if(!user.id){
            navigate('login')
        } else {
            navigate('/')
        }
    },[user.id])
    return (
        <Container fluid='md' className={isDark?'text-bg-dark p-0':'text-bg-light p-0'}>
                    <Sidebar/>
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
