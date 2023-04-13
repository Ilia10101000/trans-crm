import React from 'react';
import { Col, Row, Stack } from 'react-bootstrap';
import {SlMenu} from 'react-icons/sl'
import { useDispatch, useSelector } from 'react-redux';
import { showSidebar } from '../store/sidebarReducer';

export default function Header() {

  const {position, email} = useSelector(state => state.user);
  const dispatch = useDispatch();
  function hundlerMenuOnclick(){
    dispatch(showSidebar())
  }
  return (
        <header className='text-bg-secondary p-2'>
          <Row>
            <Col className='d-flex align-items-center'>
              <div className='menu-wrapper' onClick={hundlerMenuOnclick}>
                <Stack direction='horizontal' gap={1} className='d-flex align-items-center'>
                  <span className='d-flex align-items-center fs-3 pointer'><SlMenu/></span>
                  <span className='d-flex align-items-center fs-3 pointer'>Menu</span>
                </Stack>
              </div>
            </Col>
            <Col className='d-flex'>
              <div className='ms-auto'>
                <Stack gap={1}>
                    <span>Position: {position}</span>
                    <span>{email}</span>
                </Stack>
              </div>
            </Col>
          </Row>
          {/* <div className="background bg-secondary"></div> */}
        </header>
  )
}
