import React from 'react';
import logo from '../img/logo.png';
import {NavLink} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { hideSidebar } from '../store/sidebarReducer';
import {FiHome} from 'react-icons/fi';
import {BiTrip, BiUser} from 'react-icons/bi';
import {FaBook} from 'react-icons/fa';
import {IoMdCreate} from 'react-icons/io';
import {ImSun} from 'react-icons/im';
import {BsMoonFill} from 'react-icons/bs';
import {AiFillSetting} from 'react-icons/ai';
import {GoSignOut} from 'react-icons/go';
import { Offcanvas, Stack, Nav, Button } from 'react-bootstrap';
import { removeUser } from '../store/userReducer';
import { changeThemeMode } from '../store/themeReducer';

export default function Sidebar() {

    const {isShow} = useSelector(state => state.sidebar);
    const {isDark} = useSelector(state => state.theme);
    const {position} = useSelector(state => state.user);

    const dispatch = useDispatch();
    const handleClose = () => dispatch(hideSidebar());
    function signOut(){
        localStorage.removeItem('register-user')
        dispatch(removeUser());
    }

    React.useEffect(() => {
        if(isDark && !document.body.classList.contains('bg-black')){
            document.body.classList.add('bg-black');
        } else if (!isDark && document.body.classList.contains('bg-black')){
            document.body.classList.remove('bg-black');
        }
    },[isDark])

    function toogleThemeMode(){
        localStorage.setItem('darkMode',!isDark)
        dispatch(changeThemeMode())
    }

  return (
         <Offcanvas className={isDark?'text-bg-dark':'text-bg-light'} show={isShow} onHide={handleClose} style={{width: '250px'}}>
         <Offcanvas.Header className='mb-3' closeButton>
           <Offcanvas.Title>
            <Stack direction="horizontal" gap={3}>
                <span className="logo-img"><img style={isDark?{filter: 'invert(100%)'}:null} src={logo} alt='logo'/></span>
                <span className="logo-description fs-5">Trans CRM</span>
            </Stack>
           </Offcanvas.Title>
         </Offcanvas.Header>
         <Offcanvas.Body className='d-flex flex-column'>
            <Nav className='d-flex flex-column'>
                <Stack gap={2}>
                    <Nav.Item>
                            <NavLink to='/' className='text-decoration-none fs-5' onClick={handleClose}>
                                <Stack direction="horizontal" gap={3}>
                                    <span><FiHome/></span>
                                    <span>Home</span>
                                </Stack>
                            </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                            <NavLink to='/trips' className='text-decoration-none fs-5' onClick={handleClose}>
                                <Stack direction="horizontal" gap={3}>
                                    <span><BiTrip/></span>
                                    <span>All trips</span>
                                </Stack>
                            </NavLink>
                    </Nav.Item>
                    {(position == 'Driver' || position == 'Admin') &&
                    <Nav.Item>
                            <NavLink to='/createdtrips' className='text-decoration-none fs-5' onClick={handleClose}>
                                <Stack direction="horizontal" gap={3}>
                                    <span><IoMdCreate/></span>
                                    <span>Created trips</span>
                                </Stack>
                            </NavLink>
                    </Nav.Item>

                    }
                    <Nav.Item>
                            <NavLink to='/reservedtrips' className='text-decoration-none fs-5' onClick={handleClose}>
                                <Stack direction="horizontal" gap={3}>
                                    <span><FaBook/></span>
                                    <span>Reserved trips</span>
                                </Stack>
                            </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                            <NavLink to='/personalsettings' className='text-decoration-none fs-5' onClick={handleClose}>
                                <Stack direction="horizontal" gap={3}>
                                    <span><BiUser/></span>
                                    <span>Personal settings</span>
                                </Stack>
                            </NavLink>
                    </Nav.Item>
                     {position === 'Admin'?     
                        <Nav.Item>
                                <NavLink to='/settings' className='text-decoration-none fs-5' onClick={handleClose}>
                                    <Stack direction="horizontal" gap={3}>
                                        <span><AiFillSetting/></span>
                                        <span>Users Settings</span>
                                    </Stack>
                                </NavLink>
                        </Nav.Item>
                        : null
                    }
                </Stack>
            </Nav>
            <div className="sidebar-bottom px-3 mt-auto">
                <Stack gap={3}>
                    <Stack direction="horizontal" gap={3}>
                        <span>{isDark?<ImSun/>:<BsMoonFill/>}</span>
                        <Button variant={isDark?'light':'dark'} onClick={toogleThemeMode}>{isDark?'Light mode':'Dark mode'} </Button>
                    </Stack>
                    <Stack direction="horizontal" gap={3}>
                        <span><GoSignOut/></span>
                        <button className="btn btn-danger" onClick={signOut}>Sign out</button>
                    </Stack>
                </Stack>
            </div>
         </Offcanvas.Body>
       </Offcanvas>
  )
}
