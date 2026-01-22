import { PlacesClient } from '@googlemaps/places';

export default new PlacesClient({
    keyFilename: "./app/lib/googlePlaces/khoj-service-account.json" //default path for the service account credentials
});