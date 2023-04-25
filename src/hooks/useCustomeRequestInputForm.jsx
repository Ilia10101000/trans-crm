import React from 'react';
import { Form, FloatingLabel } from 'react-bootstrap'
import PointsResponseResult from '../Component/PointsResponseResult';
import { useDispatch} from 'react-redux';

export default function useCustomeRequestInputForm(requestFunction) {

    const [request, setRequest] = React.useState('');
    const [responseResult, setResponseResult] = React.useState([]);
    const [stillMakeRequest, setStillMakeRequest] = React.useState(true);


    React.useEffect(() => {
        if(request.length && stillMakeRequest){
            requestFunction(request, setResponseResult)
        } 
    },[request]);

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

    return [request, hundlerInputChange, responseResult, handlerClickPoint]
}