import React from 'react'
import { Button } from 'react-bootstrap'

export default function TripItem({trip, bookTrip = null}) {
  return (
    <tr>
        <td>{trip.route.split(' - ')[0]}</td>
        <td>{new Date(trip.parametres.date).toLocaleString().slice(0,-3)}</td>
        <td>{trip.parametres.seatsCount}</td>
        <td>{trip.parametres.price}$</td>
        <td>{trip.parametres.driverName}</td>
        <td>{trip.parametres.phone}</td>
        <td>{trip.parametres.car}</td>
        <td>{trip.parametres.numberOfCar}</td>
        <td className='trip-item-option'>{trip.parametres.options || '-'}</td>
        {bookTrip?
        <td><span className='d-flex justify-content-center'><Button onClick={() => bookTrip(trip)}>+</Button></span></td>
        :null
        }
     </tr>
  )
}
