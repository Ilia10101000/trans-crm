import React from 'react'
import { Button, Col, Row, InputGroup } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import useCustomeRequestInputForm from '../hooks/useCustomeRequestInputForm';
import PointsResponseResult from './PointsResponseResult';
import { getAvailableTime } from '../timeHandler';
import {MdAirlineSeatReclineNormal} from 'react-icons/md';
import {FaPlaneDeparture, FaPlaneArrival} from 'react-icons/fa';
import {BsCurrencyDollar} from 'react-icons/bs';
import {IoIosMan} from 'react-icons/io';
import {AiOutlineCalendar, AiFillCar, AiOutlineNumber} from 'react-icons/ai';
import { doc,collection, setDoc} from "firebase/firestore";
import { db } from "../firebase/firebase";
import useErrorMessage from '../hooks/useErrorMessage'
import ErrorMessage from './ErrorMessage';



export default function CreateTripForm({setShowSuccessAlert, closeForm, getTripsList}) {
    const {minDate, maxDate} = getAvailableTime();

    const {name, email, phone:phoneNumber, id: userId} = useSelector(state => state.user);
    const {isDark} = useSelector(state => state.theme);

    const [error, setError] = useErrorMessage();


    const [driverName, setDriverName] = React.useState(name || '');
    const [phone, setPhone] = React.useState(phoneNumber.slice(4) || '');
    const [price, setPrice] = React.useState('');
    const [date, setDate] = React.useState(minDate);
    const [options, setOptions] = React.useState('');
    const [numberOfCar, setNumberOfCar] = React.useState('');
    const [seatsCount, setSeatsCount] = React.useState('');
    
    const [car, setCar, carsResultsList, hundlerCarsItemPoint] = useCustomeRequestInputForm(getCars);
    const [departurePoint, setDeparturePoint, departureResultsList, hundlerDepartureItemPoint] = useCustomeRequestInputForm(getPoints);
    const [arrivalPoint, setArrivalPoint, arrivalResultsList, hundlerArrivalItemPoint] = useCustomeRequestInputForm(getPoints);

    function hundlerInputChange(event, callback){
        callback(event.target.value)
    }

    async function storeTripToPersonalCreatedTrips(tripId){

        let data = {
        driverName,
        phone: '+380' + phone,
        price,
        options,
        numberOfCar,
        car,
        departurePoint,
        arrivalPoint,
        seatsCount,
        date,
        email
        };

        try {
            const createdTripsRef = collection(db, `/users/${userId}/personal trips/Created trips/Created trips list`);
            await setDoc(doc(createdTripsRef,`${departurePoint}-${arrivalPoint} - ${date} - ${tripId}`),data);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async function storeTripDataToFireStore(tripId) {
        try {
          const tripsRef = collection(db, 'trips');
          await setDoc(doc(tripsRef,`${departurePoint}-${arrivalPoint} - ${date} - ${tripId}`), {
            arrivalPoint,
            car,
            date,
            departurePoint,
            driverName,
            numberOfCar,
            options,
            phone: '+380' + phone,
            price,
            seatsCount,
            email,
            driverId:userId
          });
          setShowSuccessAlert(true);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    async function handlerSubmitForm(event){
        event.preventDefault();
        if(departurePoint == arrivalPoint){
            setError('You have set two qual points!')
            return
        }
        const createdTripId = Date.now()
        try {
            await storeTripToPersonalCreatedTrips(createdTripId);
            await storeTripDataToFireStore(createdTripId);
            await getTripsList();
            closeForm();
        } catch (error) {
            setError(error.message);
        }
    }




    async function getPoints(value, hundlerResult){

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
                    "Limit" : "15"
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
                setError(error.message);
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
        .catch(error => setError(error.message));
    };

  return (
    <Row className='px-5'>
        <Col lg={12}>
            <form onSubmit={handlerSubmitForm}>
                <Row>
                    <Col md={6} className='d-flex justify-content-center mb-2'>
                        <InputGroup style={{width: '275px'}} className="mb-3 ">
                            <InputGroup.Text className={`${isDark?'text-bg-dark':''}`} ><IoIosMan/></InputGroup.Text>
                                <div className='form-floating'>
                                    <input type="text" value={driverName} onChange={e =>hundlerInputChange(e, setDriverName)} className={`form-control ${isDark?'text-bg-dark':''}`} id="floatingRegisterName" placeholder=" " maxLength={10} required autoComplete='off'/>
                                    <label htmlFor="floatingRegisterName">Your name</label>
                                </div>
                        </InputGroup>   
                    </Col>
                    <Col md={6} className='d-flex justify-content-center mb-2'>
                        <InputGroup style={{width: '275px'}} className="mb-3 ">
                            <InputGroup.Text className={`${isDark?'text-bg-dark':''}`}><AiOutlineCalendar/></InputGroup.Text>
                            <div className='form-floating'>
                                <input type="datetime-local" value={date} onChange={e =>hundlerInputChange(e, setDate)} className={`form-control ${isDark?'text-bg-dark':''}`} min={minDate} max={maxDate} id="floatingRegisterDate" placeholder=" " autoComplete='off' required/>
                                <label htmlFor="floatingRegisterDate">Date</label>
                            </div>
                        </InputGroup>   
                    </Col>
                    <Col md={6} className='d-flex justify-content-center mb-2'>
                        <InputGroup style={{width: '275px'}} className="mb-3 ">
                            <InputGroup.Text className={`${isDark?'text-bg-dark':''}`}><BsCurrencyDollar/></InputGroup.Text>
                            <div className='form-floating'>
                                <input type="number" value={price} onChange={e =>hundlerInputChange(e, setPrice)} className={`form-control ${isDark?'text-bg-dark':''}`} id="floatingRegisterPrice" placeholder=" " max={999} autoComplete='off' required/>
                                <label htmlFor="floatingRegisterPrice">Price</label>
                            </div>
                        </InputGroup>   
                    </Col>
                    <Col md={6} className='d-flex justify-content-center mb-2'>
                        <InputGroup style={{width: '275px'}} className="mb-3 ">
                            <InputGroup.Text className={`${isDark?'text-bg-dark':''}`}>+380</InputGroup.Text>
                            <div className='form-floating'>
                                <input type="text" value={phone} onChange={e =>hundlerInputChange(e, setPhone)} pattern='[0-9]{9}' className={`form-control ${isDark?'text-bg-dark':''}`} id="floatingRegisterPhone" placeholder=" " maxLength={9} autoComplete='off' required/>
                                <label htmlFor="floatingRegisterPhone">Phone</label>
                            </div>
                        </InputGroup>   
                    </Col>
                    <Col md={6} className='d-flex justify-content-center mb-2'>
                        <div className='custome-request-input'>
                            <InputGroup style={{width: '275px'}} className="mb-3 ">
                                <InputGroup.Text className={`${isDark?'text-bg-dark':''}`}><AiFillCar/></InputGroup.Text>
                                <div className='form-floating'>
                                    <input type="text" value={car} onChange={setCar} className={`form-control ${isDark?'text-bg-dark':''}`} id="floatingRegisterCar" placeholder=" " maxLength={9} autoComplete='off' required/>
                                    <label htmlFor="floatingRegisterCar">Car</label>
                                </div>
                            </InputGroup>   
                            <PointsResponseResult isDark={isDark} name={'car'} result={carsResultsList} clickHandler={ hundlerCarsItemPoint}/>
                        </div>
                    </Col>
                    <Col md={6} className='d-flex justify-content-center mb-2'>
                    <InputGroup style={{width: '275px'}} className="mb-3 ">
                        <InputGroup.Text className={`${isDark?'text-bg-dark':''}`}><AiOutlineNumber/></InputGroup.Text>
                        <div className='form-floating'>
                            <input type="text" value={numberOfCar} onChange={e =>hundlerInputChange(e, setNumberOfCar)} className={`form-control ${isDark?'text-bg-dark':''}`} id="floatingRegisterPhone" placeholder=" " maxLength={12} autoComplete='off'required/>
                            <label htmlFor="floatingRegisterPhone">Number of your car</label>
                        </div>
                    </InputGroup>   
                    </Col>
                    <Col md={6} className='d-flex justify-content-center mb-2'>
                    <div className='custome-request-input'>
                        <InputGroup style={{width: '275px'}} className="mb-3 ">
                            <InputGroup.Text className={`${isDark?'text-bg-dark':''}`}><FaPlaneDeparture/></InputGroup.Text>
                                <div className='form-floating'>
                                <input type="text" value={departurePoint} onChange={setDeparturePoint} className={`form-control ${isDark?'text-bg-dark':''}`} id="floatingRegisterDeparture" placeholder=" " autoComplete='off'required/>
                                <label htmlFor="floatingRegisterDeparture">Departure</label>
                            </div>
                        </InputGroup>   
                        <PointsResponseResult isDark={isDark} name={'departure point'} result={departureResultsList} clickHandler={hundlerDepartureItemPoint}/>
                    </div>
                    </Col>
                    <Col md={6} className='d-flex justify-content-center mb-2'>
                    <div className='custome-request-input'>
                        <InputGroup style={{width: '275px'}} className="mb-3 ">
                            <InputGroup.Text className={`${isDark?'text-bg-dark':''}`}><FaPlaneArrival/></InputGroup.Text>
                            <div className='form-floating'>
                                <input type="text" value={arrivalPoint} onChange={setArrivalPoint} className={`form-control ${isDark?'text-bg-dark':''}`} id="floatingRegisterArrival" placeholder=" " autoComplete='off'required/>
                                <label htmlFor="floatingRegisterArrival">Arrival</label>
                            </div>
                        </InputGroup>   
                        <PointsResponseResult isDark={isDark} name={'arrival point'} result={arrivalResultsList} clickHandler={ hundlerArrivalItemPoint}/>
                    </div>
                    </Col>
                    <Col md={6} className='d-flex justify-content-center mb-2'>
                        <InputGroup style={{width: '275px'}} className="mb-3 ">
                            <InputGroup.Text className={`${isDark?'text-bg-dark':''}`}><MdAirlineSeatReclineNormal/></InputGroup.Text>
                            <div className='form-floating'>
                                <input type="number" value={seatsCount} onChange={e =>hundlerInputChange(e, setSeatsCount)}  className={`form-control ${isDark?'text-bg-dark':''}`} id="floatingRegisterSeats"  min={1} max={15} placeholder=" " autoComplete='off'required/>
                                <label htmlFor="floatingRegisterSeats">Seats count</label>
                            </div>
                        </InputGroup>   
                    </Col>
                    <Col className='d-flex justify-content-center' md={12}>
                        <div className=" w-75 custome-input">
                            <label htmlFor="trip-text-area" className="form-label">Conditions (optional)</label>
                            <textarea value={options} onChange={e =>hundlerInputChange(e, setOptions)} className={`form-control trip-text-area ${isDark?'text-bg-dark':''}`} id="trip-text-area" rows="3" maxLength={100}></textarea>
                            <div className="input-prompt">{100 - options.length}</div>
                        </div>
                    </Col>
                    <Col md={12} className='d-flex justify-content-center mt-5'>
                        <Button type='submit'>Confirm</Button>
                    </Col>
                </Row>
            </form>
        </Col>
        {error && <ErrorMessage error={error}/>}
    </Row>
  )
}
