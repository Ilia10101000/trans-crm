import React from 'react';
import {Table} from 'react-bootstrap';
import TripItem from './TripItem';

export default function TripsTable({tripsList,userId,seatTdDescription, isDark, isPossiableProcessTrip = false, processTheTrip = null, descriptionOfProcess = null, reservedTrips = null}) {


  return (
    <Table striped bordered hover responsive variant={isDark?'dark':''}>
    <thead>
      <tr>
        <th>Route</th>
        <th>Date</th>
        <th>{seatTdDescription}</th>
        <th>Price</th>
        <th>Driver</th>
        <th>Phone</th>
        <th>Car</th>
        <th>Number of Car</th>
        <th>Conditions</th>
        <th>Book a trip</th>
      </tr>
    </thead>
    <tbody>
      {tripsList.map(trip => <TripItem key={trip.id} isPossiableProcessTrip={isPossiableProcessTrip} processTheTrip={processTheTrip} userId={userId} reservedTrips={reservedTrips} descriptionOfProcess={descriptionOfProcess} trip={{...trip}}/>)}
    </tbody>
  </Table>
  )
}
