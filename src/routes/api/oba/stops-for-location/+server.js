import stopsForLocation from '../../../../lib/RestAPI/stops-for-location.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const lat = +url.searchParams.get('lat');
	const lng = +url.searchParams.get('lng');

	const queryParams = {
		lat: lat,
		lon: lng
	};

	return stopsForLocation(queryParams);
}
