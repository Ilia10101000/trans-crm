import React from "react";
import { Button, Col, Row, Alert } from "react-bootstrap";
import CreateTripForm from "./CreateTripForm";
import { useDispatch, useSelector } from "react-redux";
import { isShowCreateForm, cancelCreateTrip} from '../store/tripReducer';
import { setError } from '../store/errorReducer';
import { setDoc, doc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export default function Trips(){

    const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
    const {isShowForm, driverName, car, numberOfCar, phone, departurePoint, arrivalPoint, options} = useSelector(state => state.trip);
    const {error} = useSelector(state => state.error);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if(showSuccessAlert){
            setTimeout(() => {
                setShowSuccessAlert(false)
            },3000)
        }
    },[showSuccessAlert])

    const hundlerButtonClick = () => {
        if(isShowForm){
            dispatch(cancelCreateTrip())
        }
        if(!isShowForm){
            dispatch(isShowCreateForm(true))
        }
    }

    const storeDataToFireStore = async () => {
                try {
                  const userRef = collection(db, 'trips');
                  await setDoc(doc(userRef,`${departurePoint} - ${arrivalPoint}`), {
                    driverName, car, numberOfCar, phone, departurePoint, arrivalPoint, options
                  });
                  setShowSuccessAlert(true);
                  return true
                } catch (error) {
                  dispatch(setError(error.message));
                  return
                }
    }

    return (
            <Row className="p-3">
                <Col>
                    <Row>
                        <Col className="d-flex">
                             <Button className="ms-auto" variant={isShowForm?'danger':'success'} onClick={hundlerButtonClick}>{isShowForm?'Cancel':'Create a trip'}</Button>
                        </Col>
                    </Row>
                    {isShowForm?
                    <Row className="mt-5">
                        <Col>
                            <CreateTripForm storeTrip={storeDataToFireStore}/>
                        </Col>
                    </Row>
                    :
                    null
                    }
                </Col>
                {
                showSuccessAlert?
                <Alert className='alert-message mx-auto' variant="success">
                <Alert.Heading>Сongratulations!</Alert.Heading>
                <p className="text-center">Trip successfully created</p>
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
            </Row>
    )
}
