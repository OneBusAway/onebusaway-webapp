import oba, { handleOBAResponse } from '$lib/obaSdk.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	const stopID = params.id;
	const response = await oba.arrivalAndDeparture.list(stopID);
	return handleOBAResponse(response, 'arrivals-and-departures-for-stop');
}
