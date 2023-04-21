import React from 'react'
import { Row } from 'react-bootstrap';
import TripItem from './TripItem';

export default function MyReservedTrips() {
    const [tripsList, setTripsList] = React.useState([]);

    
  
    return (
    <Row>
        <Col className='d-flex justify-content-center'>
            {
            tripsList.length?
            <Table striped bordered hover responsive variant={isDark?'dark':''}>
                <thead>
                    <tr>
                    <th>Route</th>
                    <th>Date</th>
                    <th>Seats</th>
                    <th>Price</th>
                    <th>Driver</th>
                    <th>Phone</th>
                    <th>Car</th>
                    <th>Number of Car</th>
                    <th>Conditions</th>
                    </tr>
                </thead>
                <tbody>
                    {tripsList.map(trip => <TripItem key={trip.route} trip={{...trip}}/>)}
                </tbody>
            </Table>
            :
            <div>You didn't reserved any trip!</div>
            }
        </Col>
    </Row>
  )
}
