import { error, json } from '@sveltejs/kit';
import oba from '$lib/obaSdk';

export default async function stopsForLocation(queryParams) {
	const response = await oba.stopsForLocation.list(queryParams);

	if (response.code !== 200) {
		error(500, 'Unable to fetch stops-for-location.');
	}

	return json(response);
}
