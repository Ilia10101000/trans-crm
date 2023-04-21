import React from "react";
import { useSelector } from 'react-redux';
import photo from '../img/photo-576.jpg'
import { Col, Row, ListGroup, Card, Button} from "react-bootstrap";

import { doc, updateDoc, deleteField} from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function Home(){

    const {isDark} = useSelector(state => state.theme);



    return (
        <Row>
            <Col className="d-flex flex-column align-items-center p-3">
                <h2 className="text-center">Welcome to fake trip managament system.</h2>
                <Row>
                    <Col md={6} className="d-flex justify-content-center">
                        <Card className={`mt-5 w-75 ${isDark?'text-bg-dark border border-light':''}`}>
                        <Card.Img variant="top" src={photo} />
                            <Card.Body>
                                <Card.Title>Frontend developer</Card.Title>
                                    This app was building using:
                                    <ul>
                                        <li>React</li>
                                        <li>React-bootstrap</li>
                                        <li>Redux-toolkit</li>
                                        <li>Firebase</li>
                                        <li>NovaPoshta API</li>
                                        <li>Dadata API</li>
                                    </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} className="d-flex flex-column align-items-center justify-content-center px-5">
                        <ListGroup className='mt-5'>
                            <ListGroup.Item   className={`d-flex justify-content-center fs-4 fw-bold ${isDark?'bg-secondary text-white':''}`}>Opportunities map:</ListGroup.Item>
                            <ListGroup.Item className={isDark?'bg-secondary text-white':''} >If you have registered as a user you can simple make book a trip which you see in 'Trips' tab.</ListGroup.Item>
                            <ListGroup.Item className={isDark?'bg-secondary text-white':''} >If you a driver, you have opportunity to create a trip setting your capabilities, conditions, price and route.</ListGroup.Item>
                            <ListGroup.Item className={isDark?'bg-secondary text-white':''} >As a admin you can see all registered user in 'Users' tab, change their status and remove them from system.</ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

