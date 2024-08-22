import { json } from '@sveltejs/kit';
import oba from '../obaSdk';

export default async function arrivalsAndDeparturesForStop(stopID) {
	const response = await oba.arrivalAndDeparture.list(stopID);
	if (response.code !== 200) {
		error(500, 'Unable to fetch arrivals-and-departures-for-stop.');
	}

	return json(response);
}
