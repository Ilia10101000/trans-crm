import React from 'react'
import logo from '../img/logo.png'
import {FiHome} from 'react-icons/fi'
import {BiTrip} from 'react-icons/bi'
import {NavLink} from 'react-router-dom'

export default function Sidebar() {
  return (
    <div className='d-flex flex-column position-relative'>
        <div className="toogle position-absolute top-0 start-100 translate-middle">!!!!!</div>
        <div>
            <div className="logo-container d-flex align-items-center">
                <div className="logo-img"><img src={logo} alt='logo'/></div>
                <div className="logo-description">Trans CRM</div>
            </div>
        </div>
        <div>
            <ul className="nav d-flex flex-column">
                <li className="nav-link">
                    <NavLink className='d-flex align-items-center'>
                        <span><FiHome/></span>
                        <span>Home</span>
                    </NavLink>
                </li>
                <li className="nav-link">
                    <NavLink className='d-flex align-items-center'>
                        <span><FiHome/></span>
                        <span>Trips</span>
                    </NavLink>
                </li>
            </ul>
            <div className="sidebar-bottom">
                <div className="toogle"></div>
                <button className="btn btn-danger">Sign out</button>
            </div>
        </div>
    </div>
  )
}
