<script>
	/* global google */
	import { onMount, onDestroy } from 'svelte';
	import { createPolyline, addArrowToPolyline } from '$lib/googleMaps';
	import { MapSource } from '$config/mapSource';
	import PopupContent from './PopupContent.svelte';

	export let mapProvider;
	export let mapSource;
	export let tripId;
	let shapeId = null;
	let polyline;
	let stopMarkers = [];
	let infoWindow;
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
				stopMarkers.forEach((marker) => marker.setMap(null));
				infoWindow?.close();
				break;
			}
			case MapSource.OpenStreetMap: {
				mapProvider.removePolyline(polyline);
				stopMarkers.forEach((marker) => marker.remove());
				infoWindow?.close();
				break;
			}
		}
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

			if (shapePoints) {
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
				addStopMarker(stopTime, stop);
			}
		}
	}

	function addStopMarker(stopTime, stop) {
		const popupContainer = document.createElement('div');

		switch (mapSource) {
			case MapSource.Google: {
				const marker = new google.maps.Marker({
					position: { lat: stop.lat, lng: stop.lon },
					map: mapProvider.map,
					icon: {
						path: google.maps.SymbolPath.CIRCLE,
						scale: 5,
						fillColor: '#FFFFFF',
						fillOpacity: 1,
						strokeWeight: 1,
						strokeColor: '#000000'
					}
				});

				marker.addListener('click', () => {
					if (infoWindow) {
						infoWindow.close();
					}

					new PopupContent({
						target: popupContainer,
						props: {
							stopName: stop.name,
							arrivalTime: stopTime.arrivalTime
						}
					});

					infoWindow = new google.maps.InfoWindow({
						content: popupContainer
					});

					infoWindow.open(mapProvider.map, marker);
				});

				stopMarkers.push(marker);
				break;
			}

			/* TODO: Update the styles for the stop marker */

			case MapSource.OpenStreetMap: {
				const customIcon = L.divIcon({
					html: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle"><circle cx="12" cy="12" r="10"/></svg>`,
					className: '',
					iconSize: [20, 20],
					iconAnchor: [10, 10]
				});

				const marker = L.marker([stop.lat, stop.lon], { icon: customIcon }).addTo(mapProvider.map);

				stopMarkers.push(marker);

				marker.on('click', () => {
					if (infoWindow) {
						infoWindow.remove();
					}

					new PopupContent({
						target: popupContainer,
						props: {
							stopName: stop.name,
							arrivalTime: stopTime.arrivalTime
						}
					});

					infoWindow = L.popup()
						.setLatLng([stop.lat, stop.lon])
						.setContent(popupContainer)
						.openOn(mapProvider.map);
				});
				break;
			}
		}
	}
</script>
