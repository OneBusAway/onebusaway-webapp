import oba from '../obaSdk';
import { json } from '@sveltejs/kit';
export default async function tripDetails(tripID, queryParams) {
	const response = await oba.tripDetails.retrieve(tripID, queryParams);
	if (response.code !== 200) {
		error(500, 'Unable to fetch trip-details.');
	}

	return json(response);
}
