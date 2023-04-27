import React from 'react';
import { Alert } from 'react-bootstrap';

export default function SuccessMessage({message}) {
  return (
    <Alert className='alert-message mx-auto' variant="success">
    <Alert.Heading>Success!</Alert.Heading>
    <p className="text-center">{message}</p>
    </Alert>
  )
}
