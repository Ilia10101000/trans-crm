import React from 'react'
import { Row, Stack, Col} from 'react-bootstrap';
import logo from '../img/logo.png';

export default function Footer() {

  return (
    <footer className='text-bg-secondary p-1'>
      <Row>
        <Col className='d-flex align-items-center'>
          <Stack>
            <div>
                <span className='logo-image'><img src={logo} alt="logo" /></span>
                <span>Designed by Ilia Krasnoper</span>
            </div>
          </Stack>
        </Col>
      </Row>
    </footer>
  )
}
