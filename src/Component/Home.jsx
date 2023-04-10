import React from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

export default function Home(){
    async function saveDataInFS(){
        try {
            const citiesRef = collection(db, "cities");

            await setDoc(doc(citiesRef, "SF"), {
                name: "San Francisco", state: "CA", country: "USA",
                capital: false, population: 860000,
                regions: ["west_coast", "norcal"] });
            await setDoc(doc(citiesRef, "LA"), {
                name: "Los Angeles", state: "CA", country: "USA",
                capital: false, population: 3900000,
                regions: ["west_coast", "socal"] });
            await setDoc(doc(citiesRef, "DC"), {
                name: "Washington, D.C.", state: null, country: "USA",
                capital: true, population: 680000,
                regions: ["east_coast"] });
            await setDoc(doc(citiesRef, "TOK"), {
                name: "Tokyo", state: null, country: "Japan",
                capital: true, population: 9000000,
                regions: ["kanto", "honshu"] });
            await setDoc(doc(citiesRef, "BJ"), {
                name: "Beijing", state: null, country: "China",
                capital: true, population: 21500000,
                regions: ["jingjinji", "hebei"] });
            await setDoc(doc(citiesRef, "SF"), {
                name: "San Francisco", state: "CA", country: "USA",
                capital: false, population: 1,
                regions: ["1000$", "4000$"] });
        } catch (error) {
            console.log(error)
        }
        
    }
    const getDataFromFS = async () => {
        try {
            const querySnapshot = await getDocs(collection(db,'salary'));
            console.log(querySnapshot)
            querySnapshot.forEach(doc => {
                console.log(doc)
                console.log(`${doc.id}: ${JSON.stringify(doc.data())}`)
            })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            Home
        </div>
    )
}