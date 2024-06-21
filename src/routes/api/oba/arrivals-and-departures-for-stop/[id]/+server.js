import { error, json } from '@sveltejs/kit';

import {
  PUBLIC_OBA_SERVER_URL as baseURL
} from '$env/static/public';

import {
  PRIVATE_OBA_API_KEY as apiKey
} from '$env/static/private';


/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
  const stopID = params.id;
  const apiURL = `${baseURL}/api/where/arrivals-and-departures-for-stop/${stopID}.json?key=${apiKey}`;
  const response = await fetch(apiURL);

  if (!response.ok) {
    error(500, "Unable to fetch arrivals-and-departures-for-stop.");
    return;
  }

  const data = await response.json();
  return json(data);
}