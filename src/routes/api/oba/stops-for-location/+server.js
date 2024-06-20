import { error, json } from '@sveltejs/kit';

import {
  PUBLIC_OBA_SERVER_URL as baseURL
} from '$env/static/public';

import {
  PRIVATE_OBA_API_KEY as apiKey
} from '$env/static/private';


/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  const lat = url.searchParams.get('lat');
  const lng = url.searchParams.get('lng');
  const apiURL = `${baseURL}/api/where/stops-for-location.json?key=${apiKey}&lat=${lat}&lon=${lng}`;
  const response = await fetch(apiURL);

  if (!response.ok) {
    error(500, "Unable to fetch stops-for-location.");
    return;
  }

  const data = await response.json();
  return json(data);
}