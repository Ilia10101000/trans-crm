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
 
                <ListGroup className="mt-5">
                    <ListGroup.Item>Opportunities map:</ListGroup.Item>
                    <ListGroup.Item variant="primary">If you have registered as a user you can simple make book a trip which you see in 'Trips' tab.</ListGroup.Item>
                    <ListGroup.Item variant="success">If you a driver, you have opportunity to create a trip setting your capabilities, conditions, price and route.</ListGroup.Item>
                    <ListGroup.Item variant="warning">As a admin you can see all registered user in 'Users' tab, change their status and remove them from system.</ListGroup.Item>
                    <ListGroup.Item variant="info">Enjoy :)</ListGroup.Item>
                </ListGroup>
                <Card className="mt-5" style={{ width: '18rem' }}>
                <Card.Img variant="top" src={photo} />
                    <Card.Body>
                        <Card.Title>Frontend developer</Card.Title>
                        <Card.Text>
                            This app was building using:
                            <ul>
                                <li>React</li>
                                <li>React-bootstrap</li>
                                <li>Redux-toolkit</li>
                                <li>Firebase</li>
                            </ul>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}