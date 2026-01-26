import client from"./client";
import z from "zod";
import {LocationSchema} from "../../schema";
import path from 'path';

export async function getLocationGeodata(locationSchema: z.infer<typeof LocationSchema>){
    
    if (!locationSchema.spotFound || !locationSchema.place){
        return null;
    }

    const {place}= locationSchema;

    const query= [
        place.name,
        place.type,
        place.locality,
        place.city,
        place.state,
        place.country
    ].join(" ");

    try{

        const [response] = await client.searchText(
            {
                textQuery: query,
                languageCode: 'en'
            },
            {
                otherArgs: {
                    headers: {
                        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.types' //https://developers.google.com/maps/documentation/places/web-service/text-search#fieldmask
                    }
                }
            }
        );

        if(!response.places){
            return null;
        }

        const result= response.places[0];   //now the places variable is an array of best matches from the searchtext function, so we pull only the most relevant place

        return {
            placeId: result.id,
            displayName: result.displayName,
            formattedAddress: result.formattedAddress,
            lat: result.location?.latitude,
            lng: result.location?.longitude,
            type: result.types
        };
    }catch(error){
        console.error("Error in getLocationGeodata:", error);
        return null;
    }

};

// getLocationGeodata({
//     "spotFound": true,
//     "place": {
//       "name": "Karim's",
//       "type": "restaurant",
//       "locality": "Jama Masjid",
//       "city": "New Delhi",
//       "state": "Delhi",
//       "country": "India"
//     },
//     "confidence": "high",
//     "source": "caption",
//     "reasoning": "Karim's is explicitly mentioned first in a food crawl itinerary through Old Delhi. Caption mentions multiple Delhi landmarks (Purani Dilli, Jama Masjid, Chandni Chowk) confirming the location. Karim's near Jama Masjid is a famous heritage restaurant and the most prominent spot as it starts the food tour."
//   })
//   .then(result => {
//     console.log('✅ Success! Location retrieved:');
//     console.log(JSON.stringify(result));
//   });