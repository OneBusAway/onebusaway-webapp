import { error, json } from '@sveltejs/kit';
import { PUBLIC_OBA_SERVER_URL as baseURL } from '$env/static/public';
import { PRIVATE_OBA_API_KEY as apiKey } from '$env/static/private';

import onebusaway from 'onebusaway-sdk';

const oba = new onebusaway({
	baseURL,
	apiKey
});

export default async function (stopID) {
	const response = await oba.arrivalAndDeparture.list(stopID);

	if (response.code !== 200) {
		error(500, 'Unable to fetch arrivals-and-departures-for-stop.');
	}

	return json(response);
}
