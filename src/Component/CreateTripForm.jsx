import React from 'react'
import { Button, Col, Row, Alert, Form, FloatingLabel } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux';
import { setError } from '../store/errorReducer';
import useCustomeRequestInputForm from '../hooks/useCustomeRequestInputForm';
import PointsResponseResult from './PointsResponseResult';
import { getAvailableTime } from '../timeHandler';



export default function CreateTripForm({storeTripToFireStore}) {
    
    const {minDate, maxDate} = getAvailableTime();

    const [driverName, setDriverName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [date, setDate] = React.useState(minDate);
    const [options, setOptions] = React.useState('');
    const [numberOfCar, setNumberOfCar] = React.useState('');
    const [seatsCount, setSeatsCount] = React.useState('');

    const [car, setCar, carsResultsList, hundlerCarsItemPoint] = useCustomeRequestInputForm(getCars);
    const [departurePoint, setDeparturePoint, departureResultsList, hundlerDepartureItemPoint] = useCustomeRequestInputForm(getPoints);
    const [arrivalPoint, setArrivalPoint, arrivalResultsList, hundlerArrivalItemPoint] = useCustomeRequestInputForm(getPoints);

    const {error} = useSelector(state => state.error);
    const dispatch = useDispatch();

    



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
                dispatch(setError(error.message));
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
        .catch(error => dispatch(setError(error.message)));
    };
    function hundlerInputChange(event, callback){
        callback(event.target.value)
    }
    function storeDataToFireStore(event){
        event.preventDefault();
        storeTripToFireStore({
            driverName,
            phone,
            price,
            options,
            numberOfCar,
            car,
            departurePoint,
            arrivalPoint,
            seatsCount,
            date
        })
}
  return (
    <Row className='px-5'>
        <Col lg={12}>
            <form onSubmit={storeDataToFireStore}>
                <Row>
                    <Col md={6} className='d-flex justify-content-center mb-2'>
                        <FloatingLabel controlId="floatingInput" label={'Your name'} className="mb-3">
                            <Form.Control type="text" value={driverName} maxLength={20}  onChange={e =>hundlerInputChange(e, setDriverName)}  placeholder=" " autoComplete='off' required/>
                        </FloatingLabel>
                    </Col>
                    <Col md={6} className='d-flex justify-content-center mb-2'>
                        <FloatingLabel style={{width: "275px"}} controlId="floatingInput" label={'Date'} className="mb-3">
                            <Form.Control type="datetime-local" value={date}  onChange={e =>hundlerInputChange(e, setDate)} min={minDate} max={maxDate}  placeholder=" " autoComplete='off' required/>
                        </FloatingLabel>
                    </Col>
                    <Col md={6} className='d-flex justify-content-center mb-2'>
                        <FloatingLabel style={{width: "275px"}} controlId="floatingInput" label={'Price for seat'} className="mb-3">
                            <Form.Control type="number" value={price} maxLength={5} min={0} max={999} onChange={e =>hundlerInputChange(e, setPrice)}  placeholder=" " autoComplete='off' required/>
                            <div className='input-prompt'>$</div>
                        </FloatingLabel>
                    </Col>
                    <Col md={6} className='d-flex justify-content-center mb-2'>
                        <div className='custome-input'>
                            <FloatingLabel controlId="floatingInput" label={'Phone number'} className="mb-3" >
                                <Form.Control type="text" value={phone} pattern='38[0-9]{3}-[0-9]{3}-[0-9]{2}-[0-9]{2}' onChange={e =>hundlerInputChange(e, setPhone)} maxLength={15} placeholder=" " autoComplete='off' required/>
                            <div className='input-prompt'>380XX-XXX-XX-XX</div>
                            </FloatingLabel>               
                        </div>
                    </Col>
                    <Col md={6} className='d-flex justify-content-center mb-2'>
                    <div className='custome-request-input'>
                        <FloatingLabel controlId="floatingInput" label={'Set your car'} className="mb-3 ">
                            <Form.Control type="text" value={car} onChange={setCar} placeholder=" " autoComplete='off' required/>
                        </FloatingLabel>
                        <PointsResponseResult name={'car'} result={carsResultsList} clickHandler={ hundlerCarsItemPoint}/>
                    </div>
                    </Col>
                    <Col md={6} className='d-flex justify-content-center mb-2'>
                        <FloatingLabel controlId="floatingInput" label={'Number of your car'} className="mb-3">
                            <Form.Control type="text" value={numberOfCar} onChange={e =>hundlerInputChange(e, setNumberOfCar)} maxLength={12} placeholder=" " autoComplete='off' required/>
                        </FloatingLabel>
                    </Col>
                    <Col md={6} className='d-flex justify-content-center mb-2'>
                    <div className='custome-request-input'>
                        <FloatingLabel controlId="floatingInput" label={'Departure point'} className="mb-3">
                            <Form.Control type="text" value={departurePoint} onChange={setDeparturePoint} placeholder=" " autoComplete='off' required/>
                        </FloatingLabel>
                        <PointsResponseResult name={'departure point'} result={departureResultsList} clickHandler={hundlerDepartureItemPoint}/>
                    </div>
                    </Col>
                    <Col md={6} className='d-flex justify-content-center mb-2'>
                    <div className='custome-request-input'>
                        <FloatingLabel controlId="floatingInput" label={'Arrival point'} className="mb-3">
                            <Form.Control type="text" value={arrivalPoint} onChange={setArrivalPoint} placeholder=" " autoComplete='off' required/>
                        </FloatingLabel>
                        <PointsResponseResult name={'arrival point'} result={arrivalResultsList} clickHandler={ hundlerArrivalItemPoint}/>
                    </div>
                    </Col>
                    <Col md={6} className='d-flex justify-content-center mb-2'>
                        <FloatingLabel style={{width: "275px"}} controlId="floatingInput" label={'Seats count'}>
                            <Form.Control  type="number" value={seatsCount}  onChange={e =>hundlerInputChange(e, setSeatsCount)} min={1} max={15}  placeholder=" " autoComplete='off' required/>
                        </FloatingLabel>
                    </Col>
                    <Col className='d-flex justify-content-center' md={12}>
                        <div className=" w-75 custome-input">
                            <label htmlFor="trip-text-area" className="form-label">Conditions (optional)</label>
                            <textarea value={options} onChange={e =>hundlerInputChange(e, setOptions)} className="form-control trip-text-area" id="trip-text-area" rows="3" maxLength={100}></textarea>
                            <div className="input-prompt">{100 - options.length}</div>
                        </div>
                    </Col>
                    <Col md={12} className='d-flex justify-content-center mt-5'>
                        <Button type='submit'>Confirm</Button>
                    </Col>
                </Row>
            </form>
        </Col>
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
