<script>
	/* global google */
	import { onMount, onDestroy } from 'svelte';
	import { createPolyline, loadGoogleMapsLibrary, addArrowToPolyline } from '$lib/googleMaps';

	export let map;
	export let tripId;

	let shapeId = null;
	let polyline;
	let stopMarkers = [];
	let infoWindow;
	let tripData = null;
	let shapeData = null;

	onMount(async () => {
		await loadGoogleMapsLibrary();
		await loadRouteData();
	});

	onDestroy(() => {
		polyline?.setMap(null);
		stopMarkers.forEach((marker) => marker.setMap(null));
		infoWindow?.close();
	});

	async function loadRouteData() {
		const tripResponse = await fetch(`/api/oba/trip-details/${tripId}`);
		tripData = await tripResponse.json();

		const tripReferences = tripData?.data?.references?.trips;
		const moreTripData = tripReferences?.find((t) => t.id == tripId);
		shapeId = moreTripData?.shapeId;

		if (shapeId) {
			const shapeResponse = await fetch(`/api/oba/shape/${shapeId}`);
			shapeData = await shapeResponse.json();
			const shape = shapeData?.data?.entry?.points;

			if (shape) {
				polyline = await createPolyline(shape);
				addArrowToPolyline(polyline);
				polyline.setMap(map);
			}
		}

		const stopTimes = tripData?.data?.entry?.schedule?.stopTimes ?? [];
		const stops = tripData?.data?.references?.stops ?? [];

		for (const stopTime of stopTimes) {
			const stop = stops.find((s) => s.id === stopTime.stopId);
			if (stop) {
				addStopMarker(stopTime, stop);
			}
		}
	}

	function addStopMarker(stopTime, stop) {
		const marker = new google.maps.Marker({
			position: { lat: stop.lat, lng: stop.lon },
			map: map,
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
			infoWindow?.close();

			infoWindow = new google.maps.InfoWindow({
				content: `<div class="my-1">
                            <h3 class='dark:text-black h3 font-semibold text-black'>${stop.name}</h3>
                            <p><span class="bg-[#8250DF] text-white py-[2px] px-[2px] rounded-md">Arrival time:</span> ${new Date(stopTime.arrivalTime * 1000).toLocaleTimeString()}</p>
                        </div>`
			});
			infoWindow.open(map, marker);
		});

		stopMarkers.push(marker);
	}
</script>
