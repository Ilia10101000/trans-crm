import React from 'react';
import { Button, Row, Col, Alert, Stack } from 'react-bootstrap';
import CreateTripForm from './CreateTripForm';
import { useSelector } from 'react-redux';
import { doc, deleteDoc, collection, getDocs} from "firebase/firestore";
import { db } from "../firebase/firebase";
import TripsTable from './TripsTable';
import useErrorMessage from '../hooks/useErrorMessage';
import ErrorMessage from './ErrorMessage'
import useSuccessMessage from '../hooks/useSuccessMessage';
import SuccessMessage from './SuccessMessage'


export default function MyCreatedTrips() {

    const [tripsList, setTripsList] = React.useState([]);
    const [showCreateForm, setShowCreateForm] = React.useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useSuccessMessage();
    const [tripForDelete, setTripForDelete] = React.useState(null);
    const [error, setError] = useErrorMessage();


    const {isDark} = useSelector(state => state.theme);
    const {id:userId} = useSelector(state => state.user);

    React.useEffect(()=>{
        getTripsList()
    },[])

    async function getTripsList(){
        try {
            const collectionRef = collection(db, `/users/${userId}/personal trips/Created trips/Created trips list`);
            const docSnap = await getDocs(collectionRef);
            if(!docSnap.empty){
                let dataArray = [];
                docSnap.forEach(doc => {
                    dataArray.push({
                        id: doc.id,
                        parametres: doc.data()
                    })
                });
                setTripsList(dataArray)
            } else if (docSnap.empty && tripsList.length){
                setTripsList([])
            }
            
            
        } catch (error) {
            console.log(error.message)
        }

    }

    async function getPassengersOfTrip(trip){
        try {
            const passengersDocsSnap = await getDocs(collection(db,`trips/${trip.id}/passengers`));
            if(passengersDocsSnap.empty){
                return []
            }
            let passengersList = [];
            passengersDocsSnap.forEach(doc => passengersList.push(doc.id))
            return passengersList
        } catch (error) {
            throw new Error(error.message)
        }
    }
    
    async function deleteTrip(trip){
        try {
            let passengersList = await getPassengersOfTrip(trip);
            console.log(passengersList)
            if(passengersList.length) {

                for(let passenger of passengersList){
                    await deleteDoc(doc(db,`users/${passenger}/personal trips/Reserved trips/Reserved trips list`,trip.id))
                    await deleteDoc(doc(db,`trips/${trip.id}/passengers/`,passenger))            
                }
            }
            await deleteDoc(doc(db, `/users/${userId}/personal trips/Created trips/Created trips list`, trip.id));
            await deleteDoc(doc(db, "trips", trip.id));
            await getTripsList();
            setTripForDelete(null)
        } catch (error) {
            setError(error.message)
        }

    }
    
  
    return (
        
    <Row>
        <Col>
            <Row className='p-3'>
                <Col className='d-flex justify-content-end'>
                     <Button className="ms-auto" variant={showCreateForm?'danger':'success'} onClick={() => setShowCreateForm(state => !state)}>{showCreateForm?'Cancel':'Create a trip'}</Button>
                </Col>
            </Row>
            <Row className='p-3'>
                <Col>
                    {showCreateForm?
                            <CreateTripForm closeForm={() => setShowCreateForm(false)} setShowSuccessAlert={setShowSuccessAlert} getTripsList={getTripsList}/>
                            :
                            <>
                            {
                            tripsList.length?
 
                                <TripsTable 
                                tripsList={tripsList} 
                                processTheTrip={setTripForDelete} 
                                isPossiableProcessTrip={true} 
                                seatTdDescription={'Seats left'}
                                descriptionOfProcess={'Delete'}
                                isDark={isDark}
                                />
                                :
                                <div className='text-center'>You didn't created any trip!</div>
                            }
                            </>
                    }
                </Col>
            </Row>
            <Row>
                <Col className='d-flex justify-content-center'>
                </Col>
            </Row>
        </Col>
        {showSuccessAlert && <SuccessMessage message={'Trip was successfully created!'}/>}
        {error && <ErrorMessage error={error}/>}
        {tripForDelete?
            <div className="alert-confirm-container">
                <Alert variant="light">
                <Alert.Heading className='text-center'>Remove trip?</Alert.Heading>
                    <Stack direction="horizontal" gap={2} className='d-flex justify-content-center mt-3'>
                        <Button onClick={() => deleteTrip(tripForDelete)}>Confirm</Button>
                        <Button variant='danger' onClick={() => setTripForDelete(null)}>Cancel</Button>
                    </Stack>
                </Alert>
            </div>
        :null
        }
    </Row>
  )
}
