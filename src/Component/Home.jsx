import React from "react";
import photo from '../img/photo-576.jpg'
import { db } from "../firebase/firebase";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { Col, Row, ListGroup, Card, Button } from "react-bootstrap";

export default function Home(){
    return (
        <Row>
            <Col className="d-flex flex-column align-items-center p-3">
                <h2>Welcome to fake trip managament system.</h2>
                <Row>
                    <Col md={6} className="d-flex justify-content-center">
                        <Card className="mt-5" style={{ width: '18rem' }}>
                        <Card.Img variant="top" src={photo} />
                            <Card.Body>
                                <Card.Title>Frontend developer</Card.Title>
                                    This app was building using:
                                    <ul>
                                        <li>React</li>
                                        <li>React-bootstrap</li>
                                        <li>Redux-toolkit</li>
                                        <li>Firebase</li>
                                    </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} className="d-flex justify-content-center">
                        <ListGroup className="mt-5">
                            <ListGroup.Item className="d-flex justify-content-center">Opportunities map:</ListGroup.Item>
                            <ListGroup.Item variant="light">If you have registered as a user you can simple make book a trip which you see in 'Trips' tab.</ListGroup.Item>
                            <ListGroup.Item variant="light">If you a driver, you have opportunity to create a trip setting your capabilities, conditions, price and route.</ListGroup.Item>
                            <ListGroup.Item variant="light">As a admin you can see all registered user in 'Users' tab, change their status and remove them from system.</ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}