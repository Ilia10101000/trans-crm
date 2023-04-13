import React from 'react';
import { setDoc, getDocs, doc, query, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import UserItem from './UserItem';
import { Button, Col, Alert,  Table} from "react-bootstrap";
import { useSelector } from 'react-redux';

export default function Settings() {
    const [usersList, setUsersList] = React.useState([]);

    const{position} = useSelector(state => state.user);
    const {changePositionList} = useSelector(state => state.changeUserPositionList)

    React.useEffect(() => {
      getUsersListFromFireStore()
    },[])

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

  return (
      <Col md={12} className='mt-3'>
        {usersList.length?
            <Table striped bordered hover responsive>
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
          <div className='mx-auto'>No one pass register</div>
        }
        <Button variant='primary' disabled={!changePositionList.length}>Confirm change</Button>
      </Col>
  )
}
