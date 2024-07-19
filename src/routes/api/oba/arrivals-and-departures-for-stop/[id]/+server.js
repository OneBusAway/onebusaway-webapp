import arrivalDepartureAPI from '$lib/RestAPI/arrivalsAndDeparturesForStop';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	return arrivalDepartureAPI(params.id);
}
