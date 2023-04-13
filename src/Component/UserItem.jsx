import React from 'react';
import { Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addForChangePosition, removeFromChangePositionList, rechangeSelectedPosition } from '../store/changeUserPositionListReducer';

const positionList = ['Admin', 'User','Driver'];

export default function UserItem({parametres,position, changeList}) {

  const [currentPosition, setCurrentPosition] = React.useState(parametres.position);
  const dispatch = useDispatch();

  function hundlerChangePosition(selectedPosition){
    console.log(selectedPosition)
    setCurrentPosition(selectedPosition)
    if(selectedPosition === parametres.position && changeList.some(item => item.email === parametres.email && item.position === parametres.position )){
      console.log('Сходятся, потому и удаляю!')
        dispatch(removeFromChangePositionList(parametres.email));
    }
    if(selectedPosition !== parametres.position && !changeList.some(item => item.email === parametres.email && item.position === selectedPosition)){
      console.log('Ставлю новую позицию!')
      dispatch(addForChangePosition({
        ...parametres, position:selectedPosition
      }))
    } if(selectedPosition !== parametres.position && changeList.some(item => item.email === parametres.email)){
      console.log('Перезаписываю позицию!')
      dispatch(rechangeSelectedPosition({email:parametres.email, position:selectedPosition}))
    }
  }

  return (
    <tr>
        <td>{parametres.email}</td>
        <td>{parametres.name}</td>
        <td>{parametres.phone}</td>
        {
          position === 'Admin' && parametres.email !== 'ilya.krasnoper@gmail.com'?
          <td>
              <Form.Select onChange={event => hundlerChangePosition(event.target.value)} size="sm">
                <option>{currentPosition}</option>
                {positionList.filter(pos => pos !== currentPosition).map(pos => <option key={pos}>{pos}</option>)}
              </Form.Select>
          </td>
          :
        <td>{parametres.position}</td>
        }
     </tr>
  )
}