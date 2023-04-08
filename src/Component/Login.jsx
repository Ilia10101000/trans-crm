import React from 'react'
import {signInWithEmailAndPassword, getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import { setUser } from '../store/userReducer';
import { googleProvider} from '../firebase';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

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
    }).catch(error => console.log(error))
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

  return (
    <div className='login-container'>
      <h2>Login</h2>
      <div className="custome-input"><input type="text" value={email} onChange={e => setEmail(e.target.value)}/></div>
      <div className="custome-input"><input type="password" value={password} onChange={e => setPassword(e.target.value)}/></div>
      <button onClick={signIn}>Login</button>
      <span>Create account <Link to='/register'>Register</Link></span>
      <div>google <button onClick={signInByGoogle}>Google</button></div>
    </div>
  )
}
