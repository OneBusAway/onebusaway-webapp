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
		const [routeResponse, stopResponse] = await Promise.all([
			oba.searchForRoute.list({ input: searchInput }),
			oba.searchForStop.list({ input: searchInput })
		]);

		return new Response(JSON.stringify({
				routeSearchResults: routeResponse.data,
				stopSearchResults: stopResponse.data,
		  }), { headers: { 'Content-Type': 'application/json' } }
		);
	} catch (error) {
		if (error.error.code == 404) {
			return new Response(JSON.stringify({ error: 'No results found' }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			});
		} else {
			return new Response(JSON.stringify({ error: 'Search failed', details: error.message }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			});
		}
	}
}
