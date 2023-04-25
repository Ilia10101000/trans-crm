import React from 'react';
import {BsFillSunFill, BsFillMoonFill, BsPhone} from 'react-icons/bs'
import {signInWithEmailAndPassword,signInWithPopup} from 'firebase/auth';
import { setUser } from '../store/userReducer';
import { googleProvider, facebookProvider, db, auth} from '../firebase/firebase';
import { collection, getDocs, where, query, setDoc, doc } from 'firebase/firestore';
import { changeThemeMode } from '../store/themeReducer';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button, Col, Container, Row, Stack, Alert } from 'react-bootstrap';
import {FcGoogle} from 'react-icons/fc'
import {GrFacebook} from 'react-icons/gr'
import RecaptchaContainer from './RecaptchaContainer';

export default function Login() {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [useSigninWithPhoneNumber, setUseSigninWithPhoneNumber] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {isDark} = useSelector(state => state.theme)

  async function signIn(e){
    e.preventDefault();
    try {
      const credentials = await signInWithEmailAndPassword(auth, email, password);
      const user = await requestUserData('email', credentials.user.email);
      dispatch(setUser(user));
      localStorage.setItem('register-user', JSON.stringify(user))
      navigate('/');
    } catch (error) {
      dispatch(setError(error.message));
    }
  };


  async function requestUserData(key, value){
    try {
      let requestUserData = query(collection(db,'users'), where(key,'==',value));
      const querySnapshot = await getDocs(requestUserData);
      return querySnapshot.docs[0].data()
    } catch (error) {
      throw new Error(error.message)
    }
  };


  async function signInByProvider(provider){

    // linkWithPopup(auth.currentUser, provider).then((result) => {
    //   // Accounts successfully linked.
    //   const credential = GoogleAuthProvider.credentialFromResult(result);
    //   const user = result.user;
    //   console.log(user)
    //   // ...
    // }).catch((error) => {
    //   // Handle Errors here.
    //   // ...
    // });


//     const credential = GoogleAuthProvider.credentialFromResult(result);
// linkWithCredential(auth.currentUser, credential)
// .then((usercred) => {
//   const user = usercred.user;
//   console.log("Account linking success", user);
// }).catch((error) => {
//   console.log("Account linking error", error);
// });


    try {

      const result = await signInWithPopup(auth, provider);
      let user;
      try {
        user = await requestUserData('email', result.user.email);
      } catch {
        user = {
        id: result.user.email,
        email: result.user.email,
        name: result.user.displayName || '',
        phone: result.user.phoneNumber || '',
        position:result.user.email === 'ilya.krasnoper@gmail.com'?'Admin':'User',
        signInMethod:'email'
      };
        await setDoc(doc(db,'users',user.id),user)
      }
      dispatch(setUser(user))
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/')
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <Container fluid className={`${isDark?'text-bg-dark':''}`}>
        <Row className='d-flex justify-content-center align-items-center min-vh-100'>
          <Col xs={5} className='d-flex flex-column justify-content-center align-items-center'>
            <div className='toogleThemeIcon' onClick={() => dispatch(changeThemeMode())}>{isDark?<BsFillSunFill/>:<BsFillMoonFill/>}</div>
            <h2 className='mb-5'>Login</h2>
            <form onSubmit={signIn}>
              <Stack className=' d-flex flex-column align-items-center' gap={3}>
                <div className="form-floating mb-3">
                    <input type="email" pattern='[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-\.]+' value={email} onChange={e => setEmail(e.target.value)} className={`form-control ${isDark?'text-bg-dark':''}`} id="floatingInputLoginEmail" placeholder=" " autoComplete='off' required/>
                    <label htmlFor="floatingInputLoginEmail">Email</label>
                    <div id="emailHelp" className="form-text"></div>
                </div>
                <div className="form-floating">
                    <input type="password" value={password} minLength={6} onChange={e => setPassword(e.target.value)} className={`form-control ${isDark?'text-bg-dark':''}`} id="floatingLoginPassword" placeholder=" " autoComplete='off' required/>
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
                  <span className='fs-2 party-service-icon' onClick={() => signInByProvider(googleProvider)}><FcGoogle/></span>
                  <span className='fs-2 party-service-icon' onClick={() => signInByProvider(facebookProvider)}><GrFacebook/></span>
                  <span className='fs-2 party-service-icon' onClick={() => setUseSigninWithPhoneNumber(true)}><BsPhone/></span>
                </Stack>
              </div>
            </Stack>
            {error && !useSigninWithPhoneNumber?
            <Alert className='alert-message' variant="danger" onClose={() => setError(null)} dismissible>
            <Alert.Heading>Alert!</Alert.Heading>
            <p>{error}</p>
            </Alert>
            :
            null
            }
          </Col>
          {useSigninWithPhoneNumber?
            <RecaptchaContainer getUserFromStore={requestUserData} close={() => setUseSigninWithPhoneNumber(false)}/>
            :null
          }
        </Row>
    </Container>
  )
}
