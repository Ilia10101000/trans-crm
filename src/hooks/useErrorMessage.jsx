import React from 'react'

export default function useErrorMessage() {
    const [error, setError] = React.useState(false);

    React.useEffect(() => {
        if(error){
            setTimeout(() => {
                setError(false)
            },3000)
        }
    },[error])
  return [error,setError]
}
