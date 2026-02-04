'use client';
import axios from 'axios';
import {AdvancedMarker, APIProvider, Map, Marker, Pin} from '@vis.gl/react-google-maps';
import {useState, useEffect} from 'react';
import {Places} from "../types";
import { PLACE_TYPE_PRIORITY, PLACE_TYPE_COLORS} from '../lib/placesTypes';

export default function MapPage(){
  const [userLocation, setUserLocation]= useState<{lat: number, lng: number}>({lat: 28.6129, lng:77.2295});  //defaults to New Delhi
  const [places, setPlaces]=useState([]);
  const [selectedPlace, setSelectedPlace]= useState<Places | null>(null);
   
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
      const response=await axios.get("api/places");
        setPlaces(response.data);
    };
    getPlaces();
  }, []);  

  useEffect(()=>{
    if(!selectedPlace) return;
    console.log("selected place is:", selectedPlace);  
  },[selectedPlace])

  return(
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
      mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID!} 
      defaultCenter={userLocation}
      style={{width: '100vw', height: '100vh'}}
      defaultZoom={12}
      gestureHandling='greedy'
      disableDefaultUI= {false}>
      
      {/*user marker*/}
      <Marker position={userLocation}/>

      {/*places marker*/}
      {places.map((place:Places)=> {
        return(
          <AdvancedMarker 
          key={place.placeId} 
          position={{lat: place.lat, lng: place.lng}} 
          onClick={()=>{
            setSelectedPlace(place);
          }}>
            <Pin
              background={PLACE_TYPE_COLORS[place.type as keyof (typeof PLACE_TYPE_COLORS)] ?? "#95A5A6"}
              glyphColor='white'
            />
          </AdvancedMarker>
        )
      })};

      </Map>
    </APIProvider>
  )

}