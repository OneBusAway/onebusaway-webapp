<script>
	import { onMount, onDestroy } from 'svelte';
	import { createPolyline, addArrowToPolyline } from '$lib/googleMaps';
	import { MapSource } from '$config/mapSource';
	import { addStopMarker, cleanupInfoWindow, cleanupStopMarkers } from '$lib/mapUtils';

	export let mapProvider;
	export let mapSource;
	export let tripId;
	let shapeId = null;
	let polyline;
	let tripData = null;
	let shapeData = null;
	let isMounted = true;

	onMount(async () => {
		await loadRouteData();
	});

	onDestroy(() => {
		isMounted = false;
		switch (mapSource) {
			case MapSource.Google: {
				polyline?.setMap(null);
				break;
			}
			case MapSource.OpenStreetMap: {
				mapProvider.removePolyline(polyline);
				break;
			}
		}
		cleanupStopMarkers();
		cleanupInfoWindow();
	});

	async function loadRouteData() {
		const tripResponse = await fetch(`/api/oba/trip-details/${tripId}`);
		tripData = await tripResponse.json();

		const tripReferences = tripData?.data?.references?.trips;
		const moreTripData = tripReferences?.find((t) => t.id == tripId);
		shapeId = moreTripData?.shapeId;

		if (shapeId && isMounted) {
			const shapeResponse = await fetch(`/api/oba/shape/${shapeId}`);
			shapeData = await shapeResponse.json();
			const shapePoints = shapeData?.data?.entry?.points;

			if (shapePoints && isMounted) {
				switch (mapSource) {
					case MapSource.Google: {
						polyline = await createPolyline(shapePoints);
						addArrowToPolyline(polyline);
						polyline.setMap(mapProvider.map);
						break;
					}
					case MapSource.OpenStreetMap: {
						polyline = mapProvider.createPolyline(shapePoints);
						break;
					}
				}
			}
		}

		const stopTimes = tripData?.data?.entry?.schedule?.stopTimes ?? [];
		const stops = tripData?.data?.references?.stops ?? [];

		for (const stopTime of stopTimes) {
			const stop = stops.find((s) => s.id === stopTime.stopId);
			if (stop && isMounted) {
				addStopMarker(mapProvider, mapSource, stop, stopTime);
			}
		}
	}
</script>
