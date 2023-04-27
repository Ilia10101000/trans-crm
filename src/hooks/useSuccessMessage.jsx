import React from 'react'

export default function useSuccessMessage() {
    const [success, setSuccess] = React.useState(false);

    React.useEffect(() => {
        if(success){
            setTimeout(() => {
                setSuccess(false)
            },3000)
        }
    },[success])
  return [success,setSuccess]
}
