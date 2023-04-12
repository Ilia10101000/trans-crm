import React from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import CustomeRequestForm from './CustomeRequestForm';
import CustomeForm from './CustomeForm';
import { setDeparturePoint, setArrivalPoint, setCar, setNumberOfCar, setOptions, isShowCreateForm, setName, setPhone, } from '../store/tripReducer';
import { useDispatch, useSelector } from 'react-redux';
import TripTextArea from './TripTextArea';



export default function CreateTripForm({storeTrip}) {

    const [sendDataToFireStore, setSendDataToFireStore] = React.useState(false);
    const dispatch = useDispatch();

    const getPoints = async (value, hundlerResult) => {

        const key = 'd6109a921ad8b4db9eb42ea743a3d0c6';
        const url = 'https://api.novaposhta.ua/v2.0/json/';

        const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        const parametres = JSON.stringify({
                "apiKey": key,
                "modelName": "Address",
                "calledMethod": "getSettlements",
                "methodProperties": {
                    "Page" : "1",
                    "Warehouse" : "1",
                    "FindByString" : value,
                    "Limit" : "10"
                }
        });
        const queryOptions = {
            method: 'POST',
            headers: myHeaders,
            body: parametres
        }
            try {
                const response = await fetch(url,queryOptions);
                const data = await response.json();             
                hundlerResult(data.data  )           
            } catch (error) {
                console.log(error.message)
            }
    };
    function getCars(value, hundlerResult){
        let url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/car_brand";
        let token = "999bc8c58d70d69bf905739447ac66645751b5f7";

        let options = {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + token
            },
            body: JSON.stringify({query: value})
        }   

        fetch(url, options)
        .then(response => response.json())
        .then(result => hundlerResult(result.suggestions))
        .catch(error => console.log("error", error));
    };

    const createTrip = async (event) => {
        event.preventDefault();

        // let promise = new Promise(res => {
        //     res(setSendDataToFireStore(true))
        // });
        
        // promise.then(() => {
        //     return new Promise(res => {
        //         setTimeout(() => {
        //             res(storeTrip())
        //         },500)
        //     })
            
        // }).then(() => {
        //     dispatch(isShowCreateForm(false))
        // }).catch(e => console.log(e.message))
        try {
            setSendDataToFireStore(true);
            await storeTrip();
            dispatch(isShowCreateForm(false))      
            
        } catch (error) {
            console.log(error.message)
        }

    }
  return (
    <Row className='px-5'>
        <Col lg={12}>
            <form onSubmit={createTrip}>
                <Row>
                    <Col md={6}>
                        <CustomeForm name='Your name' action={setName}  length={12} sendDataToFirestore={sendDataToFireStore}/>
                    </Col>
                    <Col md={6}>
                        <CustomeRequestForm name='Set your car' action={setCar} requestFunction={getCars} sendDataToFirestore={sendDataToFireStore}/>
                    </Col>
                    <Col md={6}>
                        <CustomeForm name='Number of your car' action={setNumberOfCar}  length={12} sendDataToFirestore={sendDataToFireStore}/>
                    </Col>
                    <Col md={6}>
                        <CustomeForm name='Phone number' length={15} pattern='38[0-9]{3}-[0-9]{3}-[0-9]{2}-[0-9]{2}' action={setPhone}  sendDataToFirestore={sendDataToFireStore}/>
                    </Col>
                    <Col md={6}>
                        <CustomeRequestForm name='Departure point' action={setDeparturePoint} requestFunction={getPoints} sendDataToFirestore={sendDataToFireStore}/>
                    </Col>
                    <Col md={6}>
                        <CustomeRequestForm name='Arrival point' action={setArrivalPoint} requestFunction={getPoints} sendDataToFirestore={sendDataToFireStore}/>
                    </Col>
                    <Col className='d-flex justify-content-center justify-content-md-start' md={6}>
                        <TripTextArea action={setOptions}  sendDataToFirestore={sendDataToFireStore}/>
                    </Col>
                    <Col md={12} className='d-flex justify-content-center mt-5'>
                        <Button type='submit'>Confirm</Button>
                    </Col>
                </Row>
            </form>
            <Row>
            </Row>
        </Col>
        <Col>

        </Col>
    </Row>
  )
}
