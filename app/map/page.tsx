'use client';
import axios from 'axios';
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';
import {useState, useEffect} from 'react';

export default function MapPage(){
  const [userLocation, setUserLocation]= useState<{lat: number, lng: number}>({lat: 28.61, lng:7.2});  //defaults to New Delhi
  const [places, setPlaces]=useState([]);
   
  //this is to get the user's location
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition((position)=>{
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    })
  },[]); //no dependency array so runs only once to get the users location and save them in the state variable

  //this is to get the tagged places
  useEffect(()=>{
    async function getPlaces(){
        setPlaces(await axios.get("api/places"));
    };
    getPlaces();
  }, []);  

  return(
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map 
      defaultCenter={userLocation}
      style={{width: '100vw', height: '100vh'}}
      defaultZoom={13}
      gestureHandling='greedy'
      disableDefaultUI>

      </Map>
    </APIProvider>
  )

}