import arrivalsAndDeparturesForStop from '$lib/RestAPI/arrivalsAndDeparturesForStop';

/** @type {import('./$types').RequestHandler} */

export async function GET({ params }) {
	const stopID = params.id;
	return arrivalsAndDeparturesForStop(stopID);
}
