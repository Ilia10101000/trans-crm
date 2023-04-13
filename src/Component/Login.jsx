import React from 'react'
import {signInWithEmailAndPassword, getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import { setUser } from '../store/userReducer';
import { googleProvider, facebookProvider} from '../firebase/firebase';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { setError } from '../store/errorReducer';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button, Col, Container, Row, Stack, Alert } from 'react-bootstrap';
import {FcGoogle} from 'react-icons/fc'
import {GrFacebook} from 'react-icons/gr'
import {BsPhone} from 'react-icons/bs'

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading} = useSelector(state => state.loading);
  const {error} = useSelector(state => state.error);

  async function signIn(e){
    e.preventDefault();
    try {
      const auth = getAuth();
      const credentials = await signInWithEmailAndPassword(auth, email, password);
      const user = await requestUserData(credentials.user.email);
      dispatch(setUser(user));
      localStorage.setItem('register-user', JSON.stringify(user))
      navigate('/');
    } catch (error) {
      dispatch(setError(error.message));
    }
  };


  async function requestUserData(email){
    try {
      let requestUserData = query(collection(db,'registered users'), where('email','==',email))
      const querySnapshot = await getDocs(requestUserData);
      return querySnapshot.docs[0].data()
    } catch (error) {
      throw new Error(error.message)
    }
  };


  async function signInByGoogle(){
    try {
      const auth = getAuth();
      const result = await signInWithPopup(auth, googleProvider);
      let user;
      try {
        user = await requestUserData(result.user.email);
      } catch (error) {
        user = {
        email: result.user.email,
        name: result.user.displayName || 'unknow',
        phone: result.user.phoneNumber || '-',
        position:result.user.email === 'ilya.krasnoper@gmail.com'?'Admin':'User'
      };
      }
      dispatch(setUser(user))
      localStorage.setItem('register-user', JSON.stringify(user))
      navigate('/')
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  async function signInByFacebook(){
    try {
      const auth = getAuth();
      const credentials = await signInWithPopup(auth, facebookProvider);
      console.log(credentials)
    } catch (error) {
      dispatch(setError(error.message));
    }
    
  }

  return (
    <Container fluid>
        <Row className='d-flex justify-content-center align-items-center min-vh-100'>
          <Col xs={5} className='d-flex flex-column justify-content-center align-items-center'>
            <h2 className='mb-5'>Login</h2>
            <form onSubmit={signIn}>
              <Stack className=' d-flex flex-column align-items-center' gap={3}>
                <div className="form-floating mb-3">
                    <input type="email" pattern='[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+' value={email} onChange={e => setEmail(e.target.value)} className="form-control" id="floatingInputLoginEmail" placeholder=" " autoComplete='off' required/>
                    <label htmlFor="floatingInputLoginEmail">Email</label>
                    <div id="emailHelp" className="form-text"></div>
                </div>
                <div className="form-floating">
                    <input type="password" value={password} minLength={6} onChange={e => setPassword(e.target.value)} className="form-control" id="floatingLoginPassword" placeholder=" " autoComplete='off' required/>
                    <label htmlFor="floatingLoginPassword">Password</label>
                    <div id="emailHelp" className="form-text">No less than 6 characters</div>
                </div>
                <Button type='submit' variant='success'>Log in</Button>
              </Stack>
            </form>
            <Stack className='align-items-center mt-5'>
              <span>If you don`t have account, <NavLink to='/register' className='text-decoration-none'>create it.</NavLink></span>
            </Stack>
            <Stack className='align-items-center mt-5'>
              <div>Or use party services to login</div>
              <div>
                <Stack direction='horizontal' gap={5} className='align-items-center'>
                  <span className='fs-2 party-service-icon' onClick={signInByGoogle}><FcGoogle/></span>
                  <span className='fs-2 party-service-icon' onClick={signInByFacebook}><GrFacebook/></span>
                  <span className='fs-2 party-service-icon'><BsPhone/></span>
                </Stack>
              </div>
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
