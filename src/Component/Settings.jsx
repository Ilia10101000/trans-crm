import React from 'react';
import { getDocs, doc, collection, updateDoc, increment, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Button, Col, Alert,  Stack} from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { cleanChangeList } from '../store/changeUserPositionListReducer';
import UsersTable from './UsersTable';
import useErrorMessage from '../hooks/useErrorMessage';
import ErrorMessage from './ErrorMessage';
import useSuccessMessage from '../hooks/useSuccessMessage';
import SuccessMessage from './SuccessMessage';

export default function Settings() {

    const [usersList, setUsersList] = React.useState([]);
    const [showSuccessAlert, setShowSuccessAlert] = useSuccessMessage();
    const [loading, setLoading] = React.useState(false);
    const [showRemoveUserConfirmAlert, setShowRemoveUserConfirmAlert] = React.useState(null);
    const [error, setError] = useErrorMessage();

    const {position} = useSelector(state => state.user);

    const {changePositionList} = useSelector(state => state.changeUserPositionList);
    const {isDark} = useSelector(state => state.theme);
    const dispatch = useDispatch();

    React.useEffect(() => {
      getUsersListFromFireStore()
    },[]);

    async function getUsersListFromFireStore(){
      let querySnapshot = await getDocs(collection(db,'users'));
      let data = [];
      querySnapshot.forEach(doc => {
          let trip = {
              id: doc.id,
              parametres: doc.data()
          }
          data.push(trip)
      });
      setUsersList(data)
  }

  async function restoreUsersData(){
    try {
      await Promise.all(changePositionList.map(user => updateDoc(doc(db, "users", user.id), {position: user.position})));
      dispatch(cleanChangeList());
      getUsersListFromFireStore()
      setShowSuccessAlert(true)
    } catch (error) {
      setError(error.message)
    }
  }

  async function getAllReservedTrips(user){
    let reservedTripsSnap = await getDocs(collection(db,`users/${user}/personal trips/Reserved trips/Reserved trips list`));
    if(!reservedTripsSnap.empty){
        let reservedTripsList = [];
        reservedTripsSnap.forEach(doc => reservedTripsList.push({tripId:doc.id, seats:doc.data()['seatsCount'],driver:doc.data()['driverId']}));
        return reservedTripsList
    }
    return []
}
async function getAllCreatedTrips(user){
    let reservedTripsSnap = await getDocs(collection(db,`users/${user}/personal trips/Created trips/Created trips list`));
    if(!reservedTripsSnap.empty){
        let reservedTripsList = [];
        reservedTripsSnap.forEach(doc => reservedTripsList.push(doc.id));
        return reservedTripsList
    }
    return []
}

  async function removeUserFromSystem(user){

      let reservedUsersTrips = await getAllReservedTrips(user);
      let createdUsersTrips = await getAllCreatedTrips(user);
      if(reservedUsersTrips.length){
          await Promise.all(reservedUsersTrips.map(trip => updateDoc(doc(db,`trips/${trip.tripId}`),{seatsCount:increment(trip.seats)})))
          await Promise.all(reservedUsersTrips.map(trip => updateDoc(doc(db,`users/${trip.driver}/personal trips/Created trips/Created trips list/${trip.tripId}`),{seatsCount:increment(trip.seats)})))
          await Promise.all(reservedUsersTrips.map(trip => deleteDoc(doc(db,`users/${user}/personal trips/Reserved trips/Reserved trips list/${trip.tripId}`))))
          await Promise.all(reservedUsersTrips.map(trip => deleteDoc(doc(db,`trips/${trip.tripId}/passengers/${user}`))))
      }
      if(createdUsersTrips.length){
        for(let trip of createdUsersTrips){
          let passengersTripList = await getDocs(collection(db,`trips/${trip}/passengers`))
          if(!passengersTripList.empty){
              let passengersList = [];
              passengersTripList.forEach(doc => passengersList.push(doc.id));
              await Promise.all(passengersList.map(user => deleteDoc(doc(db,`users/${user}/personal trips/Reserved trips/Reserved trips list/${trip}`))))
              await Promise.all(passengersList.map(user => deleteDoc(doc(db,`trips/${trip}/passengers/${user}`))))
          }
          await deleteDoc(doc(db,`users/${user}/personal trips/Created trips/Created trips list/${trip}`))
          await deleteDoc(doc(db,`trips/${trip}`))
        }
      }
      await deleteDoc(doc(db,`users/${user}`));
     
      
  }

  async function handlerSubmitRemoveUser(){
    setLoading(true)
    try {
      await removeUserFromSystem(showRemoveUserConfirmAlert);
      await getUsersListFromFireStore();
      setShowSuccessAlert(true)
    } catch (error) {
      setError(error.message)
    }
    finally{
      setShowRemoveUserConfirmAlert(null)
      setLoading(false)
    }
  }
  return (
      <Col md={12} className='mt-3 px-3'>
        {usersList.length?
          <UsersTable usersList={usersList} position={position} changeList={changePositionList} isDark={isDark} removeUser={setShowRemoveUserConfirmAlert}/>
          :
          <div className='mx-auto'>Nobody pass register yet</div>
        }
        <Button variant='primary' disabled={!changePositionList.length} onClick={restoreUsersData}>Confirm change</Button>
        {showSuccessAlert && <SuccessMessage message={'User successfully removed!'}/>}
        {error && <ErrorMessage error={error}/>}
        {showRemoveUserConfirmAlert?
            <div className="alert-confirm-container">
                <Alert variant="light">
                <Alert.Heading className='text-center'>Are you sure?</Alert.Heading>
                    <Stack direction="horizontal" gap={2} className='d-flex justify-content-center mt-3'>
                        <Button variant='danger' onClick={handlerSubmitRemoveUser}>Remove user</Button>
                        <Button onClick={() => setShowRemoveUserConfirmAlert(null)}>Cancel</Button>
                    </Stack>
                    {loading?
                        <div className='mt-3'>
                            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                        </div>
                        :null
                    }
                </Alert>
            </div>
        :null
        }
      </Col>
  )
}
