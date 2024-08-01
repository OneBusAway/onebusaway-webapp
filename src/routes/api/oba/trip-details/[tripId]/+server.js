import { error, json } from '@sveltejs/kit';
import { PUBLIC_OBA_SERVER_URL as baseURL } from '$env/static/public';
import { PRIVATE_OBA_API_KEY as apiKey } from '$env/static/private';

export async function GET({ params, url }) {
	const { tripId } = params;

	const serviceDate = url.searchParams.get('serviceDate');
	const includeTrip = url.searchParams.get('includeTrip') || 'true';
	const includeSchedule = url.searchParams.get('includeSchedule') || 'true';
	const includeStatus = url.searchParams.get('includeStatus') || 'true';
	const time = url.searchParams.get('time');

	let apiURL = `${baseURL}/api/where/trip-details/${tripId}.json?key=${apiKey}`;

	if (serviceDate) apiURL += `&serviceDate=${serviceDate}`;
	apiURL += `&includeTrip=${includeTrip}`;
	apiURL += `&includeSchedule=${includeSchedule}`;
	apiURL += `&includeStatus=${includeStatus}`;
	if (time) apiURL += `&time=${time}`;

	try {
		const response = await fetch(apiURL);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		// Ensure stops are included in the references
		if (!data.data.references || !data.data.references.stops) {
			// If stops are not included, we might need to fetch them separately
			// This is a placeholder for that logic
			data.data.references = data.data.references || {};
			data.data.references.stops = []; // Fetch stops here if needed
		}

		return json(data);
	} catch (err) {
		console.error('Error fetching trip details:', err);
		throw error(500, 'Unable to fetch trip details.');
	}
}
