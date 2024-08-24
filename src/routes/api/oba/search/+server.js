import { OnebusawaySDK } from 'onebusaway-sdk';
import { PUBLIC_OBA_SERVER_URL as baseUrl } from '$env/static/public';
import { PRIVATE_OBA_API_KEY as apiKey } from '$env/static/private';

const oba = new OnebusawaySDK({
	apiKey: apiKey,
	baseURL: baseUrl
});

export async function GET({ url }) {
	const searchInput = url.searchParams.get('query');

	try {
		console.log('Search input:', searchInput);

		const routeResponse = await oba.searchForRoute.retrieve({ input: searchInput });

		console.log('Route Response:', routeResponse);

		return new Response(JSON.stringify(routeResponse), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Search error:', error);

		return new Response(JSON.stringify({ error: 'Search failed', details: error.message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
