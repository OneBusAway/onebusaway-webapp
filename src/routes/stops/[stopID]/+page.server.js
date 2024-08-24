import oba, { handleOBAResponse } from '$lib/obaSdk.js';

export async function load({ params }) {
	const stopID = params.stopID;

	const stopResponse = await oba.stop.retrieve(stopID);
	const stopBody = await handleOBAResponse(stopResponse, 'stop').json();

	const arrivalsAndDeparturesResponse = await oba.arrivalAndDeparture.list(stopID);

	const arrivalsAndDeparturesResponseJSON = await handleOBAResponse(
		arrivalsAndDeparturesResponse,
		'arrivals-and-departures-for-stop'
	).json();

	return {
		stopID: params.stopID,
		stopData: stopBody.data,
		arrivalsAndDeparturesResponse: arrivalsAndDeparturesResponseJSON
	};
}
