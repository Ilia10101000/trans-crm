import React from 'react'
import { ListGroup } from 'react-bootstrap'

export default function PointsResponseResult({result, clickHandler, name, isDark}) {
    if(!result.length){
        return null
    }
    if(name.endsWith('car')){
        return (
            <ListGroup className='result-items-list'>
            {result.map(item => <ListGroup.Item className={`list-item ${isDark?'bg-dark text-white':''}`} key={item.data.id} onClick={() => clickHandler(item.value)}>{item.value}</ListGroup.Item>)}
            </ListGroup>
        )
    }
    if(name.endsWith('point')){
        return (
              <ListGroup className='result-items-list'>
                  {result.map(item => <ListGroup.Item className={`list-item ${isDark?'bg-dark text-white':''}`} key={item.Ref} onClick={() => clickHandler(item.Description)}>{item.Description}. {item.AreaDescription?item.AreaDescription:null}</ListGroup.Item>)}
              </ListGroup>
        )
    }
}
