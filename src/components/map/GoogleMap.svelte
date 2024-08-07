<script>
	/* global google */
	import { browser } from '$app/environment';
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import {
		PUBLIC_OBA_GOOGLE_MAPS_API_KEY as apiKey,
		PUBLIC_OBA_REGION_CENTER_LAT as initialLat,
		PUBLIC_OBA_REGION_CENTER_LNG as initialLng
	} from '$env/static/public';
	import { pushState } from '$app/navigation';

	import { createMap, loadGoogleMapsLibrary, nightModeStyles } from '$lib/googleMaps';
	import LocationButton from '$lib/LocationButton/LocationButton.svelte';
	import StopMarker from './StopMarker.svelte';

	import { debounce } from '$lib/utils';

	const dispatch = createEventDispatcher();

	let map = null;

	let markers = [];

	async function loadStopsForLocation(lat, lng) {
		const response = await fetch(`/api/oba/stops-for-location?lat=${lat}&lng=${lng}`);
		if (!response.ok) {
			throw new Error('Failed to fetch locations');
		}
		return await response.json();
	}

	async function initMap() {
		const element = document.getElementById('map');
		map = await createMap({ element, lat: initialLat, lng: initialLng });

		await loadStopsAndAddMarkers(initialLat, initialLng);

		const debouncedLoadMarkers = debounce(async () => {
			const center = map.getCenter();
			await loadStopsAndAddMarkers(center.lat(), center.lng());
		}, 300);

		map.addListener('dragend', debouncedLoadMarkers);
		map.addListener('zoom_changed', debouncedLoadMarkers);

		if (browser) {
			window.addEventListener('themeChange', handleThemeChange);
		}
	}

	async function loadStopsAndAddMarkers(lat, lng) {
		const json = await loadStopsForLocation(lat, lng);
		const stops = json.data.list;

		for (const s of stops) {
			if (markerExists(s)) {
				continue;
			}

			addMarker(s);
		}
	}

	function markerExists(s) {
		return markers.some((marker) => marker.s.id === s.id);
	}

	function addMarker(s) {
		const container = document.createElement('div');
		document.body.appendChild(container);
		function handleClick() {
			pushState(`/stops/${s.id}`);
			dispatch('stopSelected', { stop: s });
		}

		new StopMarker({
			target: container,
			props: {
				stop: s,
				onClick: handleClick
			}
		});

		const marker = new window.google.maps.Marker({
			map: map,
			position: { lat: s.lat, lng: s.lon },
			icon: {
				url:
					'data:image/svg+xml;charset=UTF-8,' +
					encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'),
				anchor: new google.maps.Point(0, 0),
				scaledSize: new google.maps.Size(1, 1)
			},
			label: {
				text: ' ',
				fontSize: '0px'
			},
			optimized: false
		});
		const overlay = new google.maps.OverlayView();
		overlay.setMap(map);
		overlay.draw = function () {
			const projection = this.getProjection();
			const position = projection.fromLatLngToDivPixel(marker.getPosition());
			container.style.left = position.x - 20 + 'px';
			container.style.top = position.y - 20 + 'px';
			container.style.position = 'absolute';
			this.getPanes().overlayMouseTarget.appendChild(container);
		};
		markers.push({ s, marker, overlay, element: container });
	}

	function handleThemeChange(event) {
		const { darkMode } = event.detail;
		const styles = darkMode ? nightModeStyles() : null;
		map.setOptions({ styles });
	}

	function handleLocationObtained(event) {
		const { latitude, longitude } = event.detail;
		const userLocation = new google.maps.LatLng(latitude, longitude);
		map.setCenter(userLocation);

		new google.maps.Marker({
			map: map,
			position: userLocation,
			title: 'Your Location',
			icon: {
				path: google.maps.SymbolPath.CIRCLE,
				scale: 8,
				fillColor: '#007BFF',
				fillOpacity: 1,
				strokeWeight: 2,
				strokeColor: '#FFFFFF'
			}
		});
	}

	onMount(async () => {
		loadGoogleMapsLibrary(apiKey);
		await initMap();
		if (browser) {
			const darkMode = document.documentElement.classList.contains('dark');
			const event = new CustomEvent('themeChange', { detail: { darkMode } });
			window.dispatchEvent(event);
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('themeChange', handleThemeChange);
		}
		markers.forEach(({ marker, overlay, element }) => {
			marker.setMap(null);
			overlay.setMap(null);
			if (element && element.parentNode) {
				element.parentNode.removeChild(element);
			}
		});
	});
</script>

<div id="map"></div>
<LocationButton on:locationObtained={handleLocationObtained} />

<style>
	#map {
		height: 100vh;
		width: 100%;
	}
</style>
