import React from 'react';
import { Col, Row, Stack, DropdownButton, Button } from 'react-bootstrap';
import {SlMenu} from 'react-icons/sl'
import { useDispatch, useSelector } from 'react-redux';
import { showSidebar } from '../store/sidebarReducer';

export default function Header() {

  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  function hundlerMenuOnclick(){
    dispatch(showSidebar())
  }
  return (
        <header className='text-bg-secondary p-2'> 
          <Row>
            <Col className='d-flex align-items-center'>
              <Button variant='secondary' className='menu-wrapper' onClick={hundlerMenuOnclick}>
                <Stack direction='horizontal' gap={2} className='d-flex align-items-center'>
                  <span className='d-flex align-items-center fs-3 pointer'><SlMenu/></span>
                  <span className='d-flex align-items-center fs-3 pointer'>Menu</span>
                </Stack>
              </Button>
            </Col>
            <Col className='d-flex align-items-center'>
              <div className='ms-auto'>
                <DropdownButton variant='secondary' title={`Position: ${user.position}`}>
                <Stack className='p-2' gap={2}>
                      <div><b>Name:</b> {user.name}</div>
                      <div className='text-nowrap'><b>Email:</b> {user.email}</div>
                      <div><b>Phone:</b> {user.phone}</div>
                </Stack>
                </DropdownButton>
              </div>
            </Col>
          </Row>
        </header>
  )
}