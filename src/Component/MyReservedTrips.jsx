import React from 'react'
import { Button, Row, Col, Table, Alert, Stack } from 'react-bootstrap';
import TripItem from './TripItem';
import { useSelector } from 'react-redux';
import { doc, updateDoc, getDocs,collection, deleteDoc, increment} from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function MyReservedTrips() {
    const [tripsList, setTripsList] = React.useState([]);
    const [tripForCancel, setTripForCancel] = React.useState(null);
    const [error, setError] = React.useState(null)


    const {isDark} = useSelector(state => state.theme);
    const {email, phone:phoneNumber, id:userId} = useSelector(state => state.user);

    
    React.useEffect(()=>{
        getTripsList()
    },[])
    React.useEffect(()=>{
        if(error){
            setTimeout(() => {
                setError(null)
            },2500)
        }
    },[error])

    async function getTripsList(){
        try {
            const docRef = collection(db, `users/${userId}/personal trips/Reserved trips/Reserved trips list`);
            const docSnap = await getDocs(docRef);
            if(!docSnap.empty){
    
                let dataArray = [];
                docSnap.forEach(doc => {
                    dataArray.push({
                        id:doc.id,
                        parametres: doc.data()
                    })
                })
                
                setTripsList(dataArray)
            } else if(docSnap.empty && tripsList.length){
                setTripsList([])              
            }
            
        } catch (error) {
            console.log(error.message)
        }
    }

    async function cancelTrip(){
        try {
            await deleteDoc(doc(db,`users/${userId}/personal trips/Reserved trips/Reserved trips list`,tripForCancel.id))
            await deleteDoc(doc(db,`trips/${tripForCancel.id}/passengers/`,userId))
            await updateDoc(doc(db,'trips',tripForCancel.id),{
                seatsCount: increment(tripForCancel.parametres.seatsCount)
            });
            await updateDoc(doc(db,`users/${tripForCancel.parametres.driverId}/personal trips/Created trips/Created trips list`,tripForCancel.id),{
                seatsCount: increment(tripForCancel.parametres.seatsCount)
            });
            setTripForCancel(null);
            await getTripsList()
        } catch (error) {
            setError(error.message)
        }
    }

  
    return (
    <Row className='p-3'>
        <Col>
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
                    {tripsList.map(trip => <TripItem key={trip.id} processTheTrip={setTripForCancel} descriptionOfProcess={'Cancel'} trip={{...trip.parametres}}/>)}
                </tbody>
            </Table>
            :
            <div className='text-center mt-3'>You didn't reserved any trip!</div>
            }
        </Col>
        {tripForCancel?
            <div className="alert-confirm-container">
                <Alert variant="light">
                <Alert.Heading className='text-center'>Cancel trip?</Alert.Heading>
                    <Stack direction="horizontal" gap={2} className='d-flex justify-content-center mt-3'>
                        <Button onClick={cancelTrip}>Confirm</Button>
                        <Button variant='danger' onClick={() => setTripForCancel(null)}>Cancel</Button>
                    </Stack>
                </Alert>
            </div>
        :null
        }
        {error?
        <Alert className='alert-message mx-auto' variant="warning">
        <Alert.Heading>Alert!</Alert.Heading>
        <p className="text-center">{error}</p>
        </Alert>
        :
        null
        }
    </Row>
  )
}
