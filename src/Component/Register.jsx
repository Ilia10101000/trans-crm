import React from 'react'
import {createUserWithEmailAndPassword, getAuth} from 'firebase/auth';
import { setUser } from '../store/userReducer';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Button, Col, Container, Row, Stack } from 'react-bootstrap';
export default function Register() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate()

  function signUp(){
    const auth = getAuth();

    createUserWithEmailAndPassword(auth, email, password)
    .then(credentials => {
        console.log(credentials);
        localStorage.setItem('userEmail', credentials.user.email)
        dispatch(setUser({email: credentials.user.email}));
        navigate('/')
    }).catch(error => console.log(error))
  }

  return (
    <Container fluid>
    <Row className='d-flex justify-content-center align-items-center min-vh-100'>
      <Col xs={5} className='d-flex flex-column justify-content-center align-items-center'>
        <h2 className='mb-5'>Register</h2>
        <Stack className='align-items-center' gap={3}>
          <div className="form-floating mb-3">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control" id="floatingInput" placeholder=" "/>
              <label htmlFor="floatingInput">Email</label>
          </div>
          <div className="form-floating">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control" id="floatingPassword" placeholder=" "/>
              <label htmlFor="floatingPassword">Password</label>
          </div>
          <Button variant='success' onClick={signUp}>Log in</Button>
        </Stack>
        <Stack className='align-items-center mt-5'>
          <span>Already have account? <NavLink to='/login' className='text-decoration-none'>Log in</NavLink></span>
        </Stack>
      </Col>
    </Row>
</Container>
  )
}
