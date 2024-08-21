import stopAPI from '$lib/RestAPI/stop.js';
import arrivalDepartureAPI from '$lib/RestAPI/arrivalsAndDeparturesForStop.js';

export async function load({ params }) {
	const stopID = params.stopID;
	const stopResponse = await stopAPI(stopID);

	const arrivalsAndDeparturesResponse = await arrivalDepartureAPI(stopID);
	const arrivalsAndDeparturesResponseJson = await arrivalsAndDeparturesResponse.json();

	return {
		stopID: params.stopID,
		stopData: stopResponse.data,
		arrivalsAndDeparturesResponse: arrivalsAndDeparturesResponseJson
	};
}
