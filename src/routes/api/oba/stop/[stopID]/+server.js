import stopAPI from '$lib/RestAPI/stop';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	return stopAPI(params.stopID);
}
