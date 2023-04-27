import React from 'react';
import { Alert } from 'react-bootstrap';

export default function ErrorMessage({error}) {
  return (
    <Alert className='alert-message mx-auto' variant="danger">
    <Alert.Heading>Alert!</Alert.Heading>
    <p className="text-center">{error}</p>
    </Alert>
  )
}
