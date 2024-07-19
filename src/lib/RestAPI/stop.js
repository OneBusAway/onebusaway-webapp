import { error, json } from '@sveltejs/kit';

import { PUBLIC_OBA_SERVER_URL as baseURL } from '$env/static/public';
import { PRIVATE_OBA_API_KEY as apiKey } from '$env/static/private';

export default async function(stopID) {
	const apiURL = `${baseURL}/api/where/stop/${stopID}.json?key=${apiKey}`;
	const response = await fetch(apiURL);

	if (!response.ok) {
		return error(500, 'Unable to fetch arrivals-and-departures-for-stop.');
	}

	const data = await response.json();
	return json(data);
}
