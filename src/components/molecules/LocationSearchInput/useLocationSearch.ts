import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

interface Location {
  city: string;
  region: string;
  latitude: number;
  longitude: number;
}

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const useLocationSearch = (minLength: number = 3, delay: number = 500) => {
  const [query, setQuery] = useState<string>('');
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const cache = useRef<{ [key: string]: Location[] }>({});

  const debouncedFetch = useRef(
    debounce(async (searchText: string) => {
      if (searchText.length < minLength) {
        setLocations([]);
        setLoading(false);
        return;
      }

      if (cache.current[searchText]) {
        setLocations(cache.current[searchText]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const autocompleteResponse = await axios.get(
          'https://maps.googleapis.com/maps/api/place/autocomplete/json',
          {
            params: {
              input: searchText,
              types: '(cities)',
              key: GOOGLE_PLACES_API_KEY,
            },
          },
        );

        if (autocompleteResponse.data.status === 'OK') {
          const predictions = autocompleteResponse.data.predictions;

          const detailsPromises = predictions.map((place: any) =>
            axios.get(
              'https://maps.googleapis.com/maps/api/place/details/json',
              {
                params: {
                  place_id: place.place_id,
                  fields: 'address_component,geometry',
                  key: GOOGLE_PLACES_API_KEY,
                },
              },
            ),
          );

          const detailsResponses = await Promise.all(detailsPromises);

          const formattedLocations: Location[] = detailsResponses
            .map((detail) => {
              const addressComponents = detail.data.result.address_components;
              const geometry = detail.data.result.geometry;

              const city = addressComponents.find((component: any) =>
                component.types.includes('locality'),
              )?.long_name;

              const region = addressComponents.find((component: any) =>
                component.types.includes('administrative_area_level_1'),
              )?.long_name;

              const latitude = geometry?.location?.lat;
              const longitude = geometry?.location?.lng;

              if (city && region && latitude && longitude) {
                return { city, region, latitude, longitude };
              }
              return null;
            })
            .filter((loc): loc is Location => loc !== null);

          const uniqueLocations = Array.from(
            new Map(
              formattedLocations.map((loc) => [
                `${loc.city}-${loc.region}`,
                loc,
              ]),
            ).values(),
          );

          cache.current[searchText] = uniqueLocations;
          setLocations(uniqueLocations);
        } else {
          console.error(
            'Google Places API Error:',
            autocompleteResponse.data.status,
          );
          setLocations([]);
        }
      } catch (err) {
        console.error('Error fetching locations:', err);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    }, delay),
  ).current;

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  const handleChange = useCallback(
    (text: string) => {
      setQuery(text);
      setLoading(true);
      debouncedFetch(text);
    },
    [debouncedFetch],
  );

  const cancelFetch = useCallback(() => {
    debouncedFetch.cancel();
    setLoading(false);
  }, [debouncedFetch]);

  return {
    query,
    handleChange,
    locations,
    loading,
    setQuery,
    setLocations,
    cancelFetch,
  };
};

export default useLocationSearch;
