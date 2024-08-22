import arrivalsAndDeparturesForStop from '../../../lib/RestAPI/arrivalsAndDeparturesForStop.js';
import stop from '../../../lib/RestAPI/stop.js';

export async function load({ params }) {
	const stopID = params.stopID;
	const stopResponse = await stop(stopID);
	const stopBody = await stopResponse.json();
	const arrivalsAndDeparturesResponse = await arrivalsAndDeparturesForStop(stopID);
	const arrivalsAndDeparturesResponseJSON = await arrivalsAndDeparturesResponse.json();

	return {
		stopID: params.stopID,
		stopData: stopBody.data,
		arrivalsAndDeparturesResponse: arrivalsAndDeparturesResponseJSON
	};
}
