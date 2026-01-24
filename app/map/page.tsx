'use client';
import axios from 'axios';
import {APIProvider, Map, Marker} from '@vis.gl/react-google-maps';
import {useState, useEffect} from 'react';

export default function MapPage(){
  const [userLocation, setUserLocation]= useState<{lat: number, lng: number}>({lat: 28.6129, lng:77.2295});  //defaults to New Delhi
  const [places, setPlaces]=useState([]);
  const [selectedPlace, setSelectedPlace]= useState([]);
   
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

  return(
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map 
      defaultCenter={userLocation}
      style={{width: '100vw', height: '100vh'}}
      defaultZoom={12}
      gestureHandling='greedy'
      disableDefaultUI= {false}>
      
      {/*user marker*/}
      <Marker position={userLocation}/>

      {/*places marker*/}
      {places.map((place)=> {
        return(
          <Marker 
          key={place.placeId} 
          position={{lat: place.lat, lng: place.lng}} 
          title={place.displayName}
          onClick={()=>{
            setSelectedPlace(place);
            console.log("selected place is:", selectedPlace);  
          }}
          icon={"https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png"}
          />
        )
      })};


      </Map>
    </APIProvider>
  )

}