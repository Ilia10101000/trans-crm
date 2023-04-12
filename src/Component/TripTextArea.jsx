import React from 'react'
import { useDispatch } from 'react-redux';

export default function TripTextArea({action, sendDataToFirestore}) {

    const [value, setValue] = React.useState('');
    const dispatch = useDispatch();

    function hundlerChange(e){
        setValue(e.target.value)
    }

    React.useEffect(() => {
      if(sendDataToFirestore){
          dispatch(action(value))
      }
  },[sendDataToFirestore])
  return (
    <div className="w-100 custome-input">
        <label htmlFor="trip-text-area" className="form-label">Conditions (optional)</label>
        <textarea value={value} onChange={hundlerChange} className="form-control trip-text-area" id="trip-text-area" rows="3" maxLength={100}></textarea>
        <div className="input-prompt">{100 - value.length}</div>
    </div>
  )
}
