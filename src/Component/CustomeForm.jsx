import React from 'react';
import {FloatingLabel, Form} from 'react-bootstrap';
import { useDispatch } from 'react-redux';

export default function CustomeForm({name, action, length, pattern, sendDataToFirestore}) {
    
    const [value, setValue] = React.useState('');
    const dispatch = useDispatch();

    function hundlerInputChange(e){
        setValue(e.target.value)
    }

    React.useEffect(() => {
      if(sendDataToFirestore){
          dispatch(action(value))
          // console.log('Send: ', value)
      }
  },[sendDataToFirestore])
  return (
    <div className='custome-input'>
        <FloatingLabel controlId="floatingInput" label={name} className="mb-3">
            <Form.Control type="text" value={value} pattern={pattern?pattern:null} onChange={e =>hundlerInputChange(e)} maxLength={length} placeholder=" " autoComplete='off' required/>
        </FloatingLabel>
        {name === 'Phone number'?
        <div className='input-prompt'>380XX-XXX-XX-XX</div>
        :
        null
        }
    </div>
  )
}
