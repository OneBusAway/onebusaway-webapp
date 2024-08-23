import { error, json } from '@sveltejs/kit';
import oba from '$lib/obaSdk';

export default async function stop(stopID) {
	const response = await oba.stop.retrieve(stopID);
	if (response.code !== 200) {
		error(500, 'Unable to fetch stop.');
	}

	return json(response);
}
