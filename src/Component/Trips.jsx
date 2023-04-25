import React from 'react';
import { Button, Col, Row, Alert, Table, Stack, FloatingLabel, Form} from "react-bootstrap";
import { useSelector } from "react-redux";
import { setDoc, getDocs, doc, query, collection, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import TripItem from './TripItem';


export default function Trips(){

    const [tripsList, setTripsList] = React.useState([]);
    const [error, setError] = React.useState(false);
    const [reservedTrip, setReservedTrip] = React.useState(null);
    const [reservedTripsListFromFirestore, setReservedTripsListFromFirestore] = React.useState(null);
    const user = useSelector(state => state.user);
    const {isDark} = useSelector(state => state.theme)
    const {email, phone:phoneNumber,id:userId} = useSelector(state => state.user);

    React.useEffect(() => {
        getTripsListFromFireStore();
        getReservedTripsList();
    },[]);

    React.useEffect(() => {
        if(error){
            setTimeout(() => {
                setError(null)
            },2500)
        }
    },[error]);
    
    const inputReserveRef = React.useRef()


    async function getTripsListFromFireStore(){
        let q = query(collection(db,'trips'));
        let querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach(doc => {
            let trip = {
                id: doc.id,
                parametres: doc.data()
            }
            data.push(trip)
        });
        setTripsList(data)
    }

    async function getReservedTripsList(){
        try {
            const reservedTripsRef = collection(db, `/users/${userId}/personal trips/Reserved trips/Reserved trips list`);
            const reservedTripsSnap = await getDocs(reservedTripsRef);
            if(reservedTripsSnap.empty){
                setReservedTripsListFromFirestore([]);
                return
            } 
            let tripsIdList = [];
            reservedTripsSnap.forEach( doc => tripsIdList.push(doc.id))
            setReservedTripsListFromFirestore(tripsIdList)
        } catch (error) {
            setError(error.message)
        }
    }

    async function makeTripReserve(event){
        event.preventDefault();
        try {
            if(+inputReserveRef.current.value > +reservedTrip.parametres.seatsCount){
                setError('Your wish seats count is more than capacity!')
                return
            }
            if(!inputReserveRef.current.value.startsWith('0')){
                const reservedTripsRef = collection(db, `/users/${userId}/personal trips/Reserved trips/Reserved trips list`);
                await setDoc(doc(reservedTripsRef,reservedTrip.id),{...reservedTrip.parametres, seatsCount:inputReserveRef.current.value});

                await updateDoc(doc(db,`/users/${reservedTrip.parametres.driverId}/personal trips/Created trips/Created trips list`, reservedTrip.id),{seatsCount: reservedTrip.parametres.seatsCount - inputReserveRef.current.value})
    
                await setDoc(doc(collection(db,`trips/${reservedTrip.id}/passengers`),userId),{email: user.email || '', phone: user.phone || '', name: user.name || '', seatsCount:inputReserveRef.current.value});
                await updateDoc(doc(db, 'trips', reservedTrip.id),{seatsCount: reservedTrip.parametres.seatsCount - inputReserveRef.current.value})
                await getTripsListFromFireStore();
                await getReservedTripsList();
                setReservedTrip(null)
                inputReserveRef.current.value = '';
            }
        } catch (error) {
            setError(error.message)
        }
    }


    return (
            <Row className="p-3">
                <Col className='mt-3'>
                {tripsList.length?
                    <Table striped bordered hover responsive variant={isDark?'dark':''}>
                    <thead>
                      <tr>
                        <th>Route</th>
                        <th>Date</th>
                        <th>Seats left</th>
                        <th>Price</th>
                        <th>Driver</th>
                        <th>Phone</th>
                        <th>Car</th>
                        <th>Number of Car</th>
                        <th>Conditions</th>
                        <th>Book a trip</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tripsList.map(trip => <TripItem key={trip.id} processTheTrip={setReservedTrip} userId={userId} reservedTrips={reservedTripsListFromFirestore} descriptionOfProcess={'Reserve'} trip={{...trip}}/>)}
                    </tbody>
                  </Table>
                  :
                  <div className='text-center'>No one trip has created!</div>
                }
                </Col>
                {reservedTrip?
                    <div className="alert-confirm-container">
                        <Alert variant="light">
                        <Alert.Heading className='text-center'>Seats count</Alert.Heading>
                        <form onSubmit={makeTripReserve}>
                            <Stack>
                                <FloatingLabel className='my-3' label={'Set seats count you wish'}>
                                    <Form.Control ref={inputReserveRef} className='my-0'  type="number" min={1} max={15}  placeholder=" " autoComplete='off'/>
                                </FloatingLabel>
                                <Stack direction="horizontal" gap={2} className='d-flex justify-content-center mt-3'>
                                    <Button type='submit'>Confirm</Button>
                                    <Button variant='danger' onClick={() => setReservedTrip(null)}>Cancel</Button>
                                </Stack>
                            </Stack>
                        </form>
                        </Alert>
                    </div>
                :null
                }
                {error?
                <Alert className='alert-message' variant="warning">
                <Alert.Heading>Something is wrong!!</Alert.Heading>
                <p>{error}</p>
                </Alert>
                :
                null
                }
            </Row>
    )
}

