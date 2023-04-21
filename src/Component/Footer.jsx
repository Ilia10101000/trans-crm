import React from 'react';
import { useSelector } from 'react-redux';
import { Row, Stack, Col} from 'react-bootstrap';
import logo from '../img/logo.png';

export default function Footer() {

  const {isDark} = useSelector(state => state.theme);

  return (
    <footer className='text-bg-secondary p-2'> 
      <Row>
        <Col className='d-flex align-items-center'>
          <Stack>
            <div>
                <span className='logo-image'><img style={isDark?{filter: 'invert(100%)'}:null} src={logo} alt="logo" /></span>
                <span>Designed by Ilia Krasnoper</span>
            </div>
          </Stack>
        </Col>
      </Row>
    </footer>
  )
}
