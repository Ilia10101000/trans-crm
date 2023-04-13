import React from 'react'

export default function useCustomeInputForm() {

    const [request, setRequest] = React.useState('');

  return [request, setRequest]
}
