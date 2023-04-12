import React from 'react';
import { Form, FloatingLabel } from 'react-bootstrap'
import PointsResponseResult from './PointsResponseResult';
import { useDispatch} from 'react-redux';

export default function CustomeRequestForm({name, action, requestFunction, sendDataToFirestore}) {

    const [request, setRequest] = React.useState('');
    const [responseResult, setResponseResult] = React.useState([]);
    const [stillMakeRequest, setStillMakeRequest] = React.useState(true);

    const dispatch = useDispatch();


    React.useEffect(() => {
        if(request.length && stillMakeRequest){
            requestFunction(request, setResponseResult)
        } 
    },[request]);

    React.useEffect(() => {
        if(sendDataToFirestore){
            dispatch(action(request))
            // console.log('Send: ', request)
        }
    },[sendDataToFirestore])

    function hundlerInputChange(e){
        setStillMakeRequest(true);
        setRequest(e.target.value)
        if(!e.target.length){
            setResponseResult([])
        }
    }

    function handlerClickPoint(request){
        setRequest(request);
        setStillMakeRequest(false);
        setResponseResult([]);
    }

  return (
    <div className='custome-request-input'>
        <FloatingLabel controlId="floatingInput" label={name} className="mb-3">
            <Form.Control type="text" value={request} onChange={hundlerInputChange} placeholder=" " autoComplete='off' required/>
        </FloatingLabel>
        <PointsResponseResult name={name} result={responseResult} clickHandler={ handlerClickPoint}/>
    </div>
  )
}
