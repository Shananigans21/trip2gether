import axios from 'axios';

const API_KEY = '9fec74c5aemsh4ac3b55485f72d7p106363jsn5458e724706a';
const API_HOST = 'travel-advisor.p.rapidapi.com';

const BASE_OPTIONS = {
  method: 'GET',
  url: 'https://travel-advisor.p.rapidapi.com/locations/search',
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': API_HOST,
  },
};

// Fetch hotels (filtered for lodging)
export async function fetchHotelsInCity(city) {
  const options = {
    ...BASE_OPTIONS,
    params: {
      query: city,
      limit: '30',
    },
  };

  const response = await axios.request(options);
  return response.data;
}

// Fetch general location suggestions (for autocomplete)
export async function fetchLocationSuggestions(query) {
  const options = {
    ...BASE_OPTIONS,
    params: {
      query,
      limit: '10',
    },
  };

  const response = await axios.request(options);
  
  // Return only unique location names
  const suggestions = response.data?.data
    ?.filter(item => item.result_object?.name)
    .map(item => ({ name: item.result_object.name }))
    .reduce((acc, curr) => {
      if (!acc.find(i => i.name === curr.name)) acc.push(curr);
      return acc;
    }, []);

  return { locations: suggestions };
}
