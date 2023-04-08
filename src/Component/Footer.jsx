import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { removeUser } from '../store/userReducer';

export default function Footer() {

    const {email} = useSelector(state => state.user);

    const dispatch = useDispatch();

    const signOut = () => {
        localStorage.removeItem('userEmail')
        dispatch(removeUser())
    }
  return (
    <div>
        <div>{email}</div>
        <button onClick={() => signOut()}>Sign out</button>
    </div>
  )
}
