/** @type {import('./$types').RequestHandler} */

import stop from '../../../../../lib/RestAPI/stop';

export async function GET({ params }) {
	const stopID = params.stopID;
	return stop(stopID);
}
