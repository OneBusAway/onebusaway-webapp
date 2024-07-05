<script>
	/* global google */
	import { browser } from '$app/environment';
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import {
		PUBLIC_OBA_GOOGLE_MAPS_API_KEY as apiKey,
		PUBLIC_OBA_REGION_CENTER_LAT as initialLat,
		PUBLIC_OBA_REGION_CENTER_LNG as initialLng
	} from '$env/static/public';

	import { createMap, loadGoogleMapsLibrary, nightModeStyles } from '$lib/googleMaps';

	import { debounce } from '$lib/utils';

	import busIcon from '$images/modes/bus.svg';

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

		const locationButton = document.createElement('button');

		locationButton.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i>';
		locationButton.classList.add('custom-map-control-button');
		document.getElementById('map').appendChild(locationButton);

		locationButton.addEventListener('click', () => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const { latitude, longitude } = position.coords;
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
					},
					() => {
						alert('Unable to retrieve your location.');
					}
				);
			} else {
				alert('Geolocation is not supported by this browser.');
			}
		});
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
		const glyphImg = document.createElement('img');
		glyphImg.src = busIcon;

		const marker = new window.google.maps.Marker({
			map: map,
			position: { lat: s.lat, lng: s.lon },
			// icon: 'path/to/custom-icon.png',
			title: s.name
		});

		marker.addListener('click', () => {
			dispatch('stopSelected', { stop: s });
		});

		markers.push({ s, marker });
	}

	function handleThemeChange(event) {
		const { darkMode } = event.detail;
		const styles = darkMode ? nightModeStyles() : null;
		map.setOptions({ styles });
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
	});
</script>

<link
	rel="stylesheet"
	href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
/>
<div id="map"></div>

<style>
	#map {
		height: 100vh;
		width: 100%;
	}
</style>
