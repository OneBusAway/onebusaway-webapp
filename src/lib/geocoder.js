export async function googleGeocode({ apiKey, query }) {
	const response = await fetch(
		`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`
	);
	const data = await response.json();

	if (data.status === 'OK') {
		return data.results[0];
	} else {
		return null;
	}
}
