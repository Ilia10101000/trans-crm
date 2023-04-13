import React from 'react'
import {createUserWithEmailAndPassword, getAuth} from 'firebase/auth';
import { setUser } from '../store/userReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { Button, Col, Container, Row, Stack, Alert, Form } from 'react-bootstrap';
import { setDoc, doc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { setError } from '../store/errorReducer';


export default function Register() {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [position, setPosition] = React.useState('User');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {loading} = useSelector(state => state.loading);
  const {error} = useSelector(state => state.error);


  const setUsersDataInFSDB = async () => {
        try {
          const userRef = collection(db, 'registered users');
          await setDoc(doc(userRef,email), {
            name,email,phone, position: email === 'ilya.krasnoper@gmail.com'?'Admin':position
          })
        } catch (error) {
          dispatch(setError(error.message));
          return
        }
  };


  const registerUser = async () => {
    const auth = getAuth();

    try {
      const credentials = await createUserWithEmailAndPassword(auth, email, password);

      const user = {
        email,
        name,
        phone,
        position: email === 'ilya.krasnoper@gmail.com'?'Admin':position,
      }
      dispatch(setUser(user));
      localStorage.setItem('register-user', JSON.stringify(user))
      navigate('/')
    } catch (error) {
      dispatch(setError(error.message));
    }
  };
  async function signUp(e){
    e.preventDefault();
    setUsersDataInFSDB()
    registerUser()

  }

  return (
    <Container fluid>
    <Row className='d-flex justify-content-center align-items-center min-vh-100'>
      <Col xs={5} className='d-flex flex-column justify-content-center align-items-center'>
        <h2 className='mb-5'>Register</h2>
        <form onSubmit={signUp}>
          <Stack className='align-items-center' gap={3}>
            <div className="form-floating mb-3">
                <input type="text" minLength={2} value={name} onChange={e => setName(e.target.value)} className="form-control" id="floatingInputRegisterName" placeholder=" " required autoComplete='off'/>
                <label htmlFor="floatingInputRegisterName">Your name</label>
            </div>
            <div className="form-floating mb-3">
                <input type="tel" maxLength={15} pattern='38[0-9]{3}-[0-9]{3}-[0-9]{2}-[0-9]{2}' value={phone} onChange={e => setPhone(e.target.value)} className="form-control" id="floatingInputRegisterPhone" placeholder=" " required autoComplete='off'/>
                <label htmlFor="floatingInputRegisterPhone">Phone</label>
                <div id="emailHelp" className="form-text">380XX-XXX-XX-XX</div>
            </div>
            <div className="form-floating mb-3">
                <input type="email" pattern='[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+' value={email} onChange={e => setEmail(e.target.value)} className="form-control" id="floatingInputRegisterEmail" placeholder=" " required autoComplete='off'/>
                <label htmlFor="floatingInputRegisterEmail">Email</label>
            </div>
            <div className="form-floating">
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control" id="floatingRegisterPassword" placeholder=" " minLength={6} required autoComplete='off'/>
                <label htmlFor="floatingRegisterPassword">Password</label>
                <div id="emailHelp" className="form-text">No less than 6 characters</div>
            </div>
            <div className='w-100'>
              <span>Select your position:</span>
              <Form.Check name='position' type='radio' label='User' id='radio-user' value='User'  onChange={e => setPosition(e.target.value)} checked={position === 'User'}/>
              <Form.Check name='position' type='radio' label='Driver' id='radio-driver' value='Driver' onChange={e => setPosition(e.target.value)} checked={position === 'Driver'}/>
            </div>
            <Button type='submit' variant='success'>Register</Button>
          </Stack>
        </form>
        <Stack className='align-items-center mt-5'>
          <span>Already have account? <NavLink to='/login' className='text-decoration-none'>Log in</NavLink></span>
        </Stack>
        {error?
            <Alert className='alert-message' variant="danger" onClose={() => dispatch(setError(null))} dismissible>
            <Alert.Heading>Alert!</Alert.Heading>
            <p>{error}</p>
            </Alert>
            :
            null
        }
      </Col>
    </Row>
</Container>
  )
}