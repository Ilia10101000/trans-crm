import React from 'react'
import { Button } from 'react-bootstrap';

export default function MyCreatedTrips() {

    const [tripsList, setTripsList] = React.useState([]);
    const [showCreateForm, setShowCreateForm] = React.useState(false)


    async function makeBookATrip(){
        let ref = doc(db,'/registered users/katya.gar@gmail.com/personal trips','Created trips');
        try {
            await updateDoc(ref, {
                ['Zhutomir-Lviv']: deleteField()
            });
            
        } catch (error) {
            console.log(error)
        }
    }
    
  
    return (
    <Row>
        <Col className='d-flex justify-content-center'>
            <Row>
                <Col>
                     <Button className="ms-auto" variant={showCreateForm?'danger':'success'} onClick={() => setShowCreateForm(state => !state)}>{isShowForm?'Cancel':'Create a trip'}</Button>
                </Col>
            </Row>
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
