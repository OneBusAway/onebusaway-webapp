import oba, { handleOBAResponse } from '$lib/obaSdk';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const lat = +url.searchParams.get('lat');
	const lng = +url.searchParams.get('lng');
	const latSpan = +url.searchParams.get('latSpan');
	const lngSpan = +url.searchParams.get('lngSpan');
	const radius = +url.searchParams.get('radius');

	const queryParams = {
		lat: lat,
		lon: lng,
		latSpan: latSpan,
		lngSpan: lngSpan,
		radius: radius
	};

	const response = await oba.stopsForLocation.list(queryParams);

	return handleOBAResponse(response, 'stops-for-location');
}
