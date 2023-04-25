import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { InputGroup, Stack, Row, Col, Button,Alert } from 'react-bootstrap';
import { updateDoc, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import {setUser} from '../store/userReducer'
import { db } from '../firebase/firebase';

export default function PersonalSetting() {
    const user = useSelector(state => state.user);

    const [email, setEmail] = React.useState(user.email || '');
    const [phone, setPhone] = React.useState(user.phone?user.phone.slice(4):'');
    const [name,setName] = React.useState(user.name || '');
    const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
    const [showConfirmAlert, setShowConfirmAlert] = React.useState(false);
    const [showLoader, setShowLoader]= React.useState(false)
    const [error, setError] = React.useState(null);


    const {isDark} = useSelector(state => state.theme);
    const dispatch = useDispatch()

    React.useEffect(()=> {
        if(showSuccessAlert){
            setTimeout(() => {
                setShowSuccessAlert(false)
            },2500)
        }
    },[showSuccessAlert]);
    React.useEffect(()=> {
        if(error){
            setTimeout(() => {
                setError(null)
            },3500)
        }
    },[error]);


    async function getAllReservedTrips(){
        let reservedTripsSnap = await getDocs(collection(db,`users/${user.id}/personal trips/Reserved trips/Reserved trips list`));
        if(!reservedTripsSnap.empty){
            let reservedTripsList = [];
            reservedTripsSnap.forEach(doc => reservedTripsList.push(doc.id));
            return reservedTripsList
        }
        return []
    }
    async function getAllCreatedTrips(){
        let reservedTripsSnap = await getDocs(collection(db,`users/${user.id}/personal trips/Created trips/Created trips list`));
        if(!reservedTripsSnap.empty){
            let reservedTripsList = [];
            reservedTripsSnap.forEach(doc => reservedTripsList.push(doc.id));
            return reservedTripsList
        }
        return []
    }

    async function updateUserData(){
        try {
            setShowLoader(true)
            await updateDoc(doc(db,'users',user.id),{
                name,
                phone: '+380' + phone,
                email
            });
            const userSnap = await getDoc(doc(db,'users',user.id));

            dispatch(setUser(userSnap.data()))
            localStorage.setItem('user', JSON.stringify(userSnap.data()));




    
            let reservedTripsList = await getAllReservedTrips();
            if(reservedTripsList.length){
                await Promise.all(reservedTripsList.map(trip => updateDoc(doc(db,`trips/${trip}/passengers/${user.id}`),{email,name,phone: '+380' + phone})))
            }







            let createdTripsList = await getAllCreatedTrips();
            if(createdTripsList.length){
                for(let trip of createdTripsList){
                    await updateDoc(doc(db,`trips/${trip}`),{
                        email:email,
                        phone: '+380' + phone,
                        driverName:name
                    })
                    await updateDoc(doc(db,`users/${user.id}/personal trips/Created trips/Created trips list/${trip}`),{
                        driverName:name,
                        email,
                        phone: '+380' + phone
                    });
                    let passengersListSnap = await getDocs(collection(db,`trips/${trip}/passengers`));
                    if(!passengersListSnap.empty){
                        let passengersList = [];
                        passengersListSnap.forEach(passenger => passengersList.push(passenger.id));
                        console.log(passengersList)


                        await Promise.all(passengersList.map(passenger => updateDoc(doc(db,`users/${passenger}/personal trips/Reserved trips/Reserved trips list/${trip}`),{
                            email:email,
                            phone: '+380' + phone,
                            driverName:name
                        })))

                    }
                }
            }
            setShowSuccessAlert(true)
            
        } catch (error) {
            setError(error.message)
        } finally {
            setShowLoader(false)
            setShowConfirmAlert(false)
        }

    }
    function submitDataChanges(e){
        e.preventDefault();
        if((user.signInMethod == 'phone' && (!name || !email)) || (user.signInMethod == 'email' && (!name || !phone))){
            setError('You can not remove your personal data!')
            return
        }
        if(user.name != name || user.email != email ||  user.phone != '+380' + phone){
            setShowConfirmAlert(true)
        }
    }
  return (
    <Row> 
        <Col className='p-5'>
            <form onSubmit={submitDataChanges}>
                <Stack direction='horizontal' gap={4}>
                    <div className="form-floating mb-3">
                        <input type="text" minLength={2} maxLength={20} value={name} onChange={e => setName(e.target.value)} className={`form-control ${isDark?'text-bg-dark':''}`} id="floatingInputRegisterName" placeholder=" " required autoComplete='off'/>
                        <label htmlFor="floatingInputRegisterName">Your name</label>
                    </div>
                    {
                        user.signInMethod == 'email' && 
                        
                        <InputGroup style={{width: '275px'}} className="mb-3 ">
                        <InputGroup.Text className={`${isDark?'text-bg-dark':''}`}>+380</InputGroup.Text>
                        <div className='form-floating'>
                            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} pattern='[0-9]{9}' className={`form-control ${isDark?'text-bg-dark':''}`} id="floatingRegisterPhone" placeholder=" " maxLength={9} required autoComplete='off'/>
                            <label htmlFor="floatingRegisterPhone">Phone</label>
                        </div>
                    </InputGroup>   
                    }
                    {
                        user.signInMethod == 'phone' && 
                        
                        <div className="form-floating mb-3">
                        <input type="email" pattern='[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+' value={email} onChange={e => setEmail(e.target.value)} className={`form-control ${isDark?'text-bg-dark':''}`} id="floatingInputRegisterEmail" placeholder=" " required autoComplete='off'/>
                        <label htmlFor="floatingInputRegisterEmail">Email</label>
                    </div>
                    }
                </Stack>
                <Button type='submit' disabled={!(user.name !== name || user.email !== email ||  user.phone !== '+380' + phone)}>Submit</Button>
                {
                    
                }
                {showSuccessAlert?
                <Alert className='alert-message mx-auto' variant="success">
                <Alert.Heading>Congratulations!</Alert.Heading>
                <p className="text-center">Data successfully updated.</p>
                </Alert>
                :
                null
                }
            </form>
                {showConfirmAlert?
                    <div className="alert-confirm-container">
                        <Alert variant="light">
                        <Alert.Heading className='text-center'>Are you sure?</Alert.Heading>
                            <Stack direction="horizontal" gap={2} className='d-flex justify-content-center mt-3'>
                                <Button onClick={updateUserData}>Confirm</Button>
                                <Button variant='danger' onClick={() => setShowConfirmAlert(false)}>Cancel</Button>
                            </Stack>
                            {showLoader?
                                <div className='mt-3'>
                                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                                </div>
                                :null
                            }
                        </Alert>
                    </div>
                :null
                }
                {error?
                <Alert className='alert-message' variant="warning">
                <Alert.Heading>Alert!</Alert.Heading>
                <p>{error}</p>
                </Alert>
                :
                null
                }
        </Col>
    </Row>
  )
}
