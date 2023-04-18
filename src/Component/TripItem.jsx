import React from 'react'
import { Button } from 'react-bootstrap'

export default function TripItem({trip, bookTrip}) {
  return (
    <tr>
        <td><span className='trip-item'>{trip.route.split(' - ')[0]}</span></td>
        <td><span className='trip-item'>{new Date(trip.parametres.date).toLocaleString().slice(0,-3)}</span></td>
        <td><span className='trip-item'>{trip.parametres.seatsCount}</span></td>
        <td><span className='trip-item'>{trip.parametres.price}$</span></td>
        <td><span className='trip-item'>{trip.parametres.driverName}</span></td>
        <td><span className='trip-item'>{trip.parametres.phone}</span></td>
        <td><span className='trip-item'>{trip.parametres.car}</span></td>
        <td><span className='trip-item'>{trip.parametres.numberOfCar}</span></td>
        <td className='trip-item-option'><span className='trip-item'>{trip.parametres.options || '-'}</span></td>
        <td className='h-100 d-flex justify-content-center align-items-center'><span><Button onClick={() => bookTrip(trip)}>+</Button></span></td>
     </tr>
  )
}
