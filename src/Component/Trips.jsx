import React from 'react';
import { Button, Col, Row, Alert, Table, Stack, FloatingLabel, Form} from "react-bootstrap";
import { useSelector } from "react-redux";
import { setDoc, getDocs, doc, query, collection, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import TripsTable from './TripsTable';
import useErrorMessage from '../hooks/useErrorMessage';
import ErrorMessage from './ErrorMessage';
import useSuccessMessage from '../hooks/useSuccessMessage';
import SuccessMessage from './SuccessMessage';


export default function Trips(){

    const [tripsList, setTripsList] = React.useState([]);
    const [showSuccessAlert, setShowSuccessAlert] = useSuccessMessage();
    const [error, setError] = useErrorMessage();
    const [reservedTrip, setReservedTrip] = React.useState(null);
    const [reservedTripsListFromFirestore, setReservedTripsListFromFirestore] = React.useState(null);
    const user = useSelector(state => state.user);
    const {isDark} = useSelector(state => state.theme)

    React.useEffect(() => {
        getTripsListFromFireStore();
        getReservedTripsList();
    },[]);
    
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
            const reservedTripsRef = collection(db, `/users/${user.id}/personal trips/Reserved trips/Reserved trips list`);
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
            if(inputReserveRef.current.value){
                if(+inputReserveRef.current.value > +reservedTrip.parametres.seatsCount){
                    setError('Your wish seats count is more than capacity!')
                    return
                }
                if(!inputReserveRef.current.value.startsWith('0')){
                    const reservedTripsRef = collection(db, `/users/${user.id}/personal trips/Reserved trips/Reserved trips list`);
                    await setDoc(doc(reservedTripsRef,reservedTrip.id),{...reservedTrip.parametres, seatsCount:inputReserveRef.current.value});
    
                    await updateDoc(doc(db,`/users/${reservedTrip.parametres.driverId}/personal trips/Created trips/Created trips list`, reservedTrip.id),{seatsCount: reservedTrip.parametres.seatsCount - inputReserveRef.current.value})
        
                    await setDoc(doc(collection(db,`trips/${reservedTrip.id}/passengers`),user.id),{email: user.email || '', phone: user.phone || '', name: user.name || '', seatsCount:inputReserveRef.current.value});
                    await updateDoc(doc(db, 'trips', reservedTrip.id),{seatsCount: reservedTrip.parametres.seatsCount - inputReserveRef.current.value})
                    await getTripsListFromFireStore();
                    await getReservedTripsList();
                    setReservedTrip(null)
                    inputReserveRef.current.value = '';
                }
                setShowSuccessAlert(true)
            }
        } catch (error) {
            setError(error.message)
        }
    }


    return (
            <Row className="p-3">
                <Col className='mt-3'>
                {tripsList.length?

                    <TripsTable 
                    tripsList={tripsList} 
                    processTheTrip={setReservedTrip} 
                    userId={user.id}
                    seatTdDescription={'Seats left'}
                    reservedTrips={reservedTripsListFromFirestore}
                    descriptionOfProcess={'Reserve'}
                    isDark={isDark}
                    />
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
                {error && <ErrorMessage error={error}/>}
                {showSuccessAlert && <SuccessMessage message={'Trip successfully reserved!'}/>}
            </Row>
    )
}

