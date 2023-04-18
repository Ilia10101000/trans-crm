import React from 'react';
import { Button, Col, Row, Alert, Table } from "react-bootstrap";
import CreateTripForm from "./CreateTripForm";
// import CreateTripForm__Deprecated__ from './CreateTripForm__Deprecated__';
import { useDispatch, useSelector } from "react-redux";
import { setError } from '../store/errorReducer';
import { isShowCreateForm, cancelCreateTrip} from '../store/tripReducer';
import { setDoc, getDocs, doc, query, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import TripItem from './TripItem';


export default function Trips(){

    const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
    const [tripsList, setTripsList] = React.useState([]);

    const {isShowForm} = useSelector(state => state.trip);
    const {error} = useSelector(state => state.error);
    const {position} = useSelector(state => state.user);
    const dispatch = useDispatch();
    console.log(tripsList)


    React.useEffect(() => {
        if(showSuccessAlert){
            setTimeout(() => {
                setShowSuccessAlert(false)
            },3000)
        }
    },[showSuccessAlert])
    React.useEffect(() => {
        getTripsListFromFireStore()
    },[])
    async function hundlerButtonClick (){
        if(isShowForm){
            dispatch(cancelCreateTrip())
        }
        if(!isShowForm){
            dispatch(isShowCreateForm(true))
        }
    }

    async function storeDataToFireStore (tripParametres) {
        try {
          const userRef = collection(db, 'trips');
          await setDoc(doc(userRef,`${tripParametres.departurePoint}-${tripParametres.arrivalPoint} - ${Date.now()}`), {
            ...tripParametres
          });
          setShowSuccessAlert(true);
          dispatch(isShowCreateForm(false));
          await getTripsListFromFireStore()
        } catch (error) {
          dispatch(setError(error.message));
        }
    }

    async function bookTrip(trip){
        try {
            await setDoc(doc(db, "trips", trip.route), {...trip.parametres, seatsCount: trip.parametres.seatsCount - 1});
            getTripsListFromFireStore()
            // setShowSuccessAlert(true)
          } catch (error) {
            console.log(error.message)
          }
    }

    async function getTripsListFromFireStore(){
        let q = query(collection(db,'trips'));
        let querySnapshot = await getDocs(q);
        let data = [];
        querySnapshot.forEach(doc => {
            let trip = {
                route: doc.id,
                parametres: doc.data()
            }
            data.push(trip)
        });
        setTripsList(data)
    }


    return (
            <Row className="p-3">
                <Col md={12}>
                    {position === 'Admin' || position === 'Driver'?
                    <Row>
                        <Col className="d-flex">
                             <Button className="ms-auto" variant={isShowForm?'danger':'success'} onClick={hundlerButtonClick}>{isShowForm?'Cancel':'Create a trip'}</Button>
                        </Col>
                    </Row>
                    :null
                    }
                    {isShowForm?
                    <Row className="mt-5">
                        <Col>
                            <CreateTripForm storeTripToFireStore={storeDataToFireStore}/>
                            {/* <CreateTripForm__Deprecated__/> */}
                        </Col>
                    </Row>
                    :
                    null
                    }
                    {showSuccessAlert?
                    <Alert className='alert-message mx-auto' variant="success">
                    <Alert.Heading>Congratulations!</Alert.Heading>
                    <p className="text-center">Trip successfully created.</p>
                    </Alert>
                    :
                    null
                    }
                    {error?
                    <Alert className='alert-message mx-auto' variant="danger" onClose={() => dispatch(setError(null))} dismissible>
                    <Alert.Heading>Alert!</Alert.Heading>
                    <p className="text-center">{error}</p>
                    </Alert>
                    :
                    null
                    }
                </Col>
                <Col md={12} className='mt-3'>
                {tripsList.length?
                    <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Route</th>
                        <th>Date</th>
                        <th>Free seats</th>
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
                      {tripsList.map(trip => <TripItem key={trip.route} bookTrip={bookTrip} trip={{...trip}}/>)}
                    </tbody>
                  </Table>
                  :
                  <div className='mx-auto'>No one trip has created</div>
                }
                </Col>
            </Row>
    )
}

