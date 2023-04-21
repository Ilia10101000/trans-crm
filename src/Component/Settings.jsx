import React from 'react';
import { setDoc, getDocs, doc, query, collection, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import UserItem from './UserItem';
import { Button, Col, Alert,  Table} from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { cleanChangeList } from '../store/changeUserPositionListReducer';
import { setError } from '../store/errorReducer';

export default function Settings() {
    const [usersList, setUsersList] = React.useState([]);
    const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);

    const {error} = useSelector(state => state.error);
    const {position} = useSelector(state => state.user);
    const {changePositionList} = useSelector(state => state.changeUserPositionList);
    const {isDark} = useSelector(state => state.theme);
    const dispatch = useDispatch();

    React.useEffect(() => {
      getUsersListFromFireStore()
    },[]);
    React.useEffect(() => {
      if(showSuccessAlert){
          setTimeout(() => {
              setShowSuccessAlert(false)
          },3000)
      }
  },[showSuccessAlert]);

    async function getUsersListFromFireStore(){
      let q = query(collection(db,'registered users'));
      let querySnapshot = await getDocs(q);
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
      const promise = await Promise.all(changePositionList.map(user => updateDoc(doc(db, "registered users", user.email), {position: user.position})));
      dispatch(cleanChangeList());
      getUsersListFromFireStore()
      setShowSuccessAlert(true)
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
      <Col md={12} className='mt-3 px-3'>
        {usersList.length?
            <Table striped bordered hover responsive variant={isDark?'dark':''}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map(user => <UserItem key={user.id} changeList={changePositionList} position={position} parametres={user.parametres}/>)}
            </tbody>
          </Table>
          :
          <div className='mx-auto'>Nobody pass register yet</div>
        }
        <Button variant='primary' disabled={!changePositionList.length} onClick={restoreUsersData}>Confirm change</Button>
        {showSuccessAlert?
        <Alert className='alert-message mx-auto' variant="success">
        <Alert.Heading>Congratulations!</Alert.Heading>
        <p className="text-center">Changes successfully saved.</p>
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
  )
}
