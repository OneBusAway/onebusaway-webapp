import { error, json } from '@sveltejs/kit';
import { PUBLIC_OBA_SERVER_URL as baseURL } from '$env/static/public';
import { PRIVATE_OBA_API_KEY as apiKey } from '$env/static/private';

export async function GET({ params }) {
	const { shapeId } = params;

	let apiURL = `${baseURL}/api/where/shape/${shapeId}.json?key=${apiKey}`;

	try {
		const response = await fetch(apiURL);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		return json(data);
	} catch (err) {
		console.error('Error fetching shape data:', err);
		throw error(500, 'Unable to fetch shape data.');
	}
}
