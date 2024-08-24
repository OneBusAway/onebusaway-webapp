import oba, { handleOBAResponse } from '$lib/obaSdk';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const lat = +url.searchParams.get('lat');
	const lng = +url.searchParams.get('lng');

	const queryParams = {
		lat: lat,
		lon: lng
	};

	const response = await oba.stopsForLocation.list(queryParams);

	return handleOBAResponse(response, 'stops-for-location');
}
