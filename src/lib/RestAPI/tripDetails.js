import { error, json } from '@sveltejs/kit';
import { PUBLIC_OBA_SERVER_URL as baseURL } from '$env/static/public';
import { PRIVATE_OBA_API_KEY as apiKey } from '$env/static/private';

export async function GET({ params, url }) {
	const { tripId } = params;
	const vehicleId = url.searchParams.get('vehicleId');
	const serviceDate = url.searchParams.get('serviceDate');

	let apiURL = `${baseURL}/api/where/trip-details/${tripId}.json?key=${apiKey}`;

	if (vehicleId) apiURL += `&vehicleId=${vehicleId}`;
	if (serviceDate) apiURL += `&serviceDate=${serviceDate}`;

	const response = await fetch(apiURL);

	if (!response.ok) {
		error(500, 'Unable to fetch trip-details.');
		return;
	}

	const data = await response.json();
	return json(data);
}
