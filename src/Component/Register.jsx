import React from 'react'
import {createUserWithEmailAndPassword, getAuth} from 'firebase/auth';
import { setUser } from '../store/userReducer';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

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
    
    <div className='register-container'>
      <h2>Register</h2>
      <div className="custome-input"><input type="text" value={email} onChange={e => setEmail(e.target.value)}/></div>
      <div className="custome-input"><input type="password" value={password} onChange={e => setPassword(e.target.value)}/></div>
      <button onClick={signUp}>Login</button>
      <div>Already have account? <Link to='/login'>Login</Link></div>
    </div>
  )
}
