import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
        <header>
            <div>
                <NavLink to='/'>Home</NavLink>
                <NavLink to='trips'>Trips</NavLink>
            </div>
        </header>
  )
}
