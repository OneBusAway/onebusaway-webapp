import { OnebusawaySDK } from 'onebusaway-sdk';

import { googleGeocode } from '$lib/geocoder';

import {
	PUBLIC_OBA_SERVER_URL as baseUrl,
	PUBLIC_OBA_REGION_CENTER_LAT as centerLat,
	PUBLIC_OBA_REGION_CENTER_LNG as centerLng
} from '$env/static/public';

import {
	PRIVATE_OBA_API_KEY as apiKey,
	PRIVATE_OBA_GEOCODER_API_KEY as geocoderApiKey,
	PRIVATE_OBA_GEOCODER_PROVIDER as geocoderProvider
} from '$env/static/private';

const oba = new OnebusawaySDK({
	apiKey: apiKey,
	baseURL: baseUrl
});

async function routeSearch(query) {
	const params = {
		lat: centerLat,
		lon: centerLng,
		query
	};
	return oba.routesForLocation.list(params);
}

async function stopSearch(query) {
	const params = {
		lat: centerLat,
		lon: centerLng,
		query
	};
	return oba.stopsForLocation.list(params);
}

async function locationSearch(query) {
	if (geocoderProvider === 'google') {
		return googleGeocode({ apiKey: geocoderApiKey, query });
	} else {
		return [];
	}
}

export async function GET({ url }) {
	const searchInput = url.searchParams.get('query')?.trim();

	const [routeResponse, stopResponse, locationResponse] = await Promise.all([
		routeSearch(searchInput),
		stopSearch(searchInput),
		locationSearch(searchInput)
	]);

	return new Response(
		JSON.stringify({
			routes: routeResponse.data.list,
			stops: stopResponse.data.list,
			location: locationResponse,
			query: searchInput
		}),
		{ headers: { 'Content-Type': 'application/json' } }
	);
}
