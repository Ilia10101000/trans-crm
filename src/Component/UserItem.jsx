import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addForChangePosition, removeFromChangePositionList, rechangeSelectedPosition } from '../store/changeUserPositionListReducer';

const positionList = ['Admin', 'User','Driver'];

export default function UserItem({parametres,position, changeList,removeUser}) {

  const [currentPosition, setCurrentPosition] = React.useState(parametres.position);
  const {isDark} = useSelector(state => state.theme)
  const dispatch = useDispatch();

  function hundlerChangePosition(selectedPosition){

    setCurrentPosition(selectedPosition);

    if(selectedPosition === parametres.position && changeList.some(item => item.id === parametres.id)){
        dispatch(removeFromChangePositionList(parametres.id));
    }
    if(selectedPosition !== parametres.position && !changeList.some(item => item.id === parametres.id)){
      dispatch(addForChangePosition({
        id:parametres.id, position:selectedPosition
      }))
    } if(selectedPosition !== parametres.position && changeList.some(item => item.id === parametres.id)){
      dispatch(rechangeSelectedPosition({id:parametres.id, position:selectedPosition}))
    }
  }

  return (
    <tr>
        <td>{parametres.name}</td>
        <td>{parametres.email}</td>
        <td>{parametres.phone}</td>
        {
          position === 'Admin' && parametres.email !== process.env.REACT_APP_ADMIN_EMAIL?
          <td>
              <Form.Select className={` ${isDark?'text-bg-dark':''}`} onChange={event => hundlerChangePosition(event.target.value)} size="sm">
                <option>{currentPosition}</option>
                {positionList.filter(pos => pos !== currentPosition).map(pos => <option key={pos}>{pos}</option>)}
              </Form.Select>
          </td>
          :
        <td>{parametres.position}</td>
        }
        {
          position === 'Admin' && parametres.email !== process.env.REACT_APP_ADMIN_EMAIL?
          <td>
              <Button variant='danger' onClick={() => removeUser(parametres.id)}>Remove</Button>
          </td>
          :
          <td></td>
        }
     </tr>
  )
}
