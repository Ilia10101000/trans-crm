import React from 'react';
import { Alert, InputGroup , Form, Button, FloatingLabel} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import {RecaptchaVerifier, signInWithPhoneNumber} from 'firebase/auth';
import { auth, db } from '../firebase/firebase';
import { setUser } from '../store/userReducer';
import { useNavigate } from 'react-router-dom';
import { setDoc, doc } from 'firebase/firestore';



export default function RecaptchaContainer({close, getUserFromStore}) {


    const [expandForm, setExpandForm] = React.useState(false);
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [verificationCode, setVerificationCode] = React.useState('');
    const [showLoader, setShowLoader] = React.useState(false)

    const [error, setError] = React.useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        if(error){
            setTimeout(() => {
                setError(null)
            },7500)
        }
    }
    ,[error]);

    function checkValidatePhoneNumber(number){
        const numberArray = number.split('');
        if(number.length < 9){
            setError('Check your phone number!');
            return false
        } 
        else if(!numberArray.every(character => !isNaN(character))){
            setError('Check your phone number. It must contains only digits!');
            return false
        }
        return true
    }

    function generateRecaptch(){
            window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                  // reCAPTCHA solved, allow signInWithPhoneNumber.
                }
              }, auth);
    }


    function getVerificationCode(){
        if(checkValidatePhoneNumber(phoneNumber)){
            setShowLoader(true)
            generateRecaptch();
            const appVerifier = window.recaptchaVerifier;
            signInWithPhoneNumber(auth, '+380' + phoneNumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                setExpandForm(true)
            }).catch((error) => {
                setExpandForm(false)
                setError(error.message);
            }).finally(() => {
                setShowLoader(false)
            });
        }
    }

    async function sendVerificationCode(e){
        let code = e.target.value;
        setVerificationCode(code)
        if(code.length == 6){
            let user;
            setShowLoader(true)
            try {
                let confirmationResult = window.confirmationResult;
                let result = await confirmationResult.confirm(code);
                try {
                    user = await getUserFromStore('phone',result.user.phoneNumber)
                } catch {
                    user = {
                        id: result.user.email || result.user.phoneNumber,
                        email: result.user.email || '',
                        name: result.user.displayName || '',
                        phone: result.user.phoneNumber,
                        position:'User',
                        signInMethod:'phone'
                    }
                    await setDoc(doc(db,'users',user.id),user)
                }
                dispatch(setUser(user))
                localStorage.setItem('user', JSON.stringify(user))
                navigate('/')
            } catch (error) {
                setError(error.message);
            } finally {
                setShowLoader(false)
            }
        }

    }

  return (
    <div className='signinPhoneNumberForm mx-auto'>
        <div className="form-container position-relative">
            <Alert variant="light" onClose={close} dismissible>
            <Alert.Heading>Sign in with phone number</Alert.Heading>
                <InputGroup className="my-3">
                    <InputGroup.Text>+380</InputGroup.Text>
                    <Form.Control type='text' maxLength={9} value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}/>
                </InputGroup>
                {expandForm?
                    <FloatingLabel className='my-3' label={'Verification code'}>
                        <Form.Control className='my-0'  type="text" value={verificationCode}  onChange={sendVerificationCode} maxLength={6} placeholder=" " autoComplete='off'/>
                    </FloatingLabel>
                    :
                    <Button variant="light" className='border' size="sm" onClick={getVerificationCode}>Get code</Button>
                }
                {showLoader?
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                    :null
                }
            </Alert>
        </div>
        {error?
            <Alert className='alert-message' variant="danger">
            <Alert.Heading>Alert!</Alert.Heading>
            <p>{error}</p>
            </Alert>
            :
            null
        }
        <div id="recaptcha-container"></div>
    </div>
  )
}
