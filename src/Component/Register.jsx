import React from 'react';
import {BsFillSunFill, BsFillMoonFill} from 'react-icons/bs'
import { Button, Col, Container, Row, Stack, Form, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { changeThemeMode } from '../store/themeReducer';
import { setUser } from '../store/userReducer';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import { setDoc, doc, collection, getDocs } from 'firebase/firestore';
import { db,auth} from '../firebase/firebase';
import useErrorMessage from '../hooks/useErrorMessage';
import ErrorMessage from './ErrorMessage'


export default function Register() {
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [position, setPosition] = React.useState('User');
  const [error, setError] = useErrorMessage();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {isDark} = useSelector(state => state.theme)


  const setUsersDataInFSDB = async () => {
          const userRef = collection(db, 'users');
          await setDoc(doc(userRef, email), {
            id: email,
            name,
            email,
            phone: '+380' + phone, 
            position: email === process.env.REACT_APP_ADMIN_EMAIL?'Admin':position,
            signInMethod:'email'
          })
  };

  async function userWithExistPhoneNumber(){
      let usersList = await getDocs(collection(db,'users'));
      if(usersList.empty){
        return 
      }
      let users = [];
      usersList.forEach(user => users.push({id:user.id,parametres:user.data()}));

      if(users.some(user => user.parametres.phone == '+380' + phone)){
        throw new Error('This phone number has already used!')

      }
  }

  const registerUser = async () => {
      await createUserWithEmailAndPassword(auth, email, password);
      const userData = {
        id: email,
        email,
        name,
        phone: '+380' + phone,
        position: email === process.env.REACT_APP_ADMIN_EMAIL?'Admin':position,
        signInMethod:'email'
      }
      dispatch(setUser(userData));
      localStorage.setItem('user', JSON.stringify(userData))
      navigate('/')

  };
    async function signUp(e){
    e.preventDefault();
    try {
      await userWithExistPhoneNumber();
      await registerUser();
      await setUsersDataInFSDB()
      
    } catch (error) {
      setError(error.message);
    }
        


  }
  function toogleThemeMode(){
    localStorage.setItem('darkMode',!isDark)
    dispatch(changeThemeMode())
  }

  return (
    <Container fluid className={`${isDark?'text-bg-dark':''}`}>
    <Row className='d-flex justify-content-center align-items-center min-vh-100'>
      <Col xs={5} className='d-flex flex-column justify-content-center align-items-center'>
        <div className='toogleThemeIcon' onClick={toogleThemeMode}>{isDark?<BsFillSunFill/>:<BsFillMoonFill/>}</div>
        <h2 className='mb-5'>Register</h2>
        <form onSubmit={signUp}>
          <Stack className='align-items-center' gap={3}>
            <div className="form-floating mb-3">
                <input type="text" minLength={2} value={name} onChange={e => setName(e.target.value)} className={`form-control ${isDark?'text-bg-dark':''}`} id="floatingInputRegisterName" placeholder=" " required autoComplete='off'/>
                <label htmlFor="floatingInputRegisterName">Your name</label>
            </div>
                <InputGroup style={{width: '275px'}} className="mb-3 ">
                    <InputGroup.Text className={`${isDark?'text-bg-dark':''}`}>+380</InputGroup.Text>
                    <div className='form-floating'>
                      <input type="text" value={phone} onChange={e => setPhone(e.target.value)} pattern='[0-9]{9}' className={`form-control ${isDark?'text-bg-dark':''}`} id="floatingRegisterPhone" placeholder=" " maxLength={9} required autoComplete='off'/>
                      <label htmlFor="floatingRegisterPhone">Phone</label>
                    </div>
                </InputGroup>   
            <div className="form-floating mb-3">
                <input type="email" pattern='[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+' value={email} onChange={e => setEmail(e.target.value)} className={`form-control ${isDark?'text-bg-dark':''}`} id="floatingInputRegisterEmail" placeholder=" " required autoComplete='off'/>
                <label htmlFor="floatingInputRegisterEmail">Email</label>
            </div>
            <div className='form-floating'>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={`form-control ${isDark?'text-bg-dark':''}`} id="floatingRegisterPassword" placeholder=" " minLength={6} required autoComplete='off'/>
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
        {error && <ErrorMessage error={error}/>}
      </Col>
    </Row>
</Container>
  )
}
