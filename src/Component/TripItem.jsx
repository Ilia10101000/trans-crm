import React from 'react'

export default function TripItem({trip}) {
  return (
    <tr>
        <td><span className='trip-item'>{trip.route}</span></td>
        <td><span className='trip-item'>{trip.parametres.driverName}</span></td>
        <td><span className='trip-item'>{trip.parametres.phone}</span></td>
        <td><span className='trip-item'>{trip.parametres.car}</span></td>
        <td><span className='trip-item'>{trip.parametres.numberOfCar}</span></td>
        <td className='trip-item-option'><span className='trip-item'>{trip.parametres.options}</span></td>
     </tr>
  )
}
