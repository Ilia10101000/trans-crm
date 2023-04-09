import React from "react";
import { collection, addDoc } from "firebase/firestore"; 
import { db } from "../firebase";

export default function Home(){
    const [value, setValue] = React.useState('');
    const [svalue, setSvalue] = React.useState('');

    async function addRecord(){
        try{
            const docRef = await addDoc(collection(db, 'user'),{
                name:value,
                secName: svalue,
                time: new Date().toDateString()
            })
            console.log("Document written with ID: ", docRef);
        } catch(e){
            console.error("Error adding document: ", e)
        }
    }
    return (
        <div>
            <input type="text" value={value} onChange={e => setValue(e.target.value)} />
            <input type="text" value={svalue} onChange={e => setSvalue(e.target.value)} />
            <button onClick={addRecord}>Add</button>
        </div>
    )
}