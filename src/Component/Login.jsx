import React from 'react'
import {signInWithEmailAndPassword, getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import { setUser } from '../store/userReducer';
import { googleProvider, facebookProvider} from '../firebase';
import { useDispatch } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button, Col, Container, Row, Stack } from 'react-bootstrap';
import {FcGoogle} from 'react-icons/fc'
import {GrFacebook} from 'react-icons/gr'
import {BsPhone} from 'react-icons/bs'

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function signIn(){
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
    .then(credentials => {
        console.log(credentials.user);
        dispatch(setUser({email: credentials.user.email}));
        navigate('/')
    }).catch(error => console.log(error.message))
  }

  function signInByGoogle(){
    const auth = getAuth();
    signInWithPopup(auth, googleProvider)
    .then(result => {
      const credentials = GoogleAuthProvider.credentialFromResult(result);
      localStorage.setItem('userEmail', result.user.email)
      dispatch(setUser({email: result.user.email}))
      navigate('/')
    })
    .catch(e => console.log(e))
  }
  function signInByFacebook(){
    const auth = getAuth();
    signInWithPopup(auth, facebookProvider)
    .then(credentials => {
      console.log(credentials)
    })
    .catch(e => console.log(e.message))
  }

  return (
    <Container fluid>
        <Row className='d-flex justify-content-center align-items-center min-vh-100'>
          <Col xs={5} className='d-flex flex-column justify-content-center align-items-center'>
            <h2 className='mb-5'>Login</h2>
            <Stack className=' d-flex flex-column align-items-center' gap={3}>
              <div className="form-floating mb-3">
                  <input style={{width: '300px'}} type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" id="floatingInput" placeholder=" "/>
                  <label htmlFor="floatingInput">Email</label>
                  <div id="emailHelp" className="form-text"></div>
              </div>
              <div className="form-floating">
                  <input style={{width: '300px'}} type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control" id="floatingPassword" placeholder=" "/>
                  <label htmlFor="floatingPassword">Password</label>
                  <div id="emailHelp" className="form-text">No less 8 characters</div>
              </div>
              <Button variant='success' onClick={signIn}>Log in</Button>
            </Stack>
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
          </Col>
        </Row>
    </Container>
  )
}
