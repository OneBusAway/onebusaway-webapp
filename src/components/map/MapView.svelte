<script>
	import { browser } from '$app/environment';
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import {
		PUBLIC_OBA_GOOGLE_MAPS_API_KEY as apiKey,
		PUBLIC_OBA_REGION_CENTER_LAT as initialLat,
		PUBLIC_OBA_REGION_CENTER_LNG as initialLng,
		PUBLIC_OBA_MAP_PROVIDER as mapProvider
	} from '$env/static/public';

	import { debounce } from '$lib/utils';
	import LocationButton from '$lib/LocationButton/LocationButton.svelte';
	import StopMarker from './StopMarker.svelte';
	import RouteMap from './RouteMap.svelte';

	import MapTypeButton from '$lib/MapTypeButton/MapTypeButton.svelte';
	import { faBus } from '@fortawesome/free-solid-svg-icons';
	import { RouteType, routePriorities, prioritizedRouteTypeForDisplay } from '$config/routeConfig';

	import GoogleMapProvider from '$lib/Provider/GoogleMapProvider';
	import OpenStreetMapProvider from '$lib/Provider/OpenStreetMapProvider';

	export let selectedTrip = null;
	export let selectedRoute = null;
	export let showRoute = false;
	export let showRouteMap = false;
	export let showAllStops = true;
	export let stop = null;

	let selectedStopID = null;

	const dispatch = createEventDispatcher();

	let mapInstance = null;
	let mapTypeId = 'roadmap';
	let mapElement;

	let markers = [];
	let allStops = [];
	let routeReference = [];

	const createMapProvider = () => {
		switch (mapProvider) {
			case 'google':
				return new GoogleMapProvider(apiKey);
			case 'osm':
				return new OpenStreetMapProvider();
			default:
				throw new Error(`Unsupported map provider: ${mapProvider}`);
		}
	};

	async function loadStopsForLocation(lat, lng) {
		const response = await fetch(`/api/oba/stops-for-location?lat=${lat}&lng=${lng}`);
		if (!response.ok) {
			throw new Error('Failed to fetch locations');
		}
		return await response.json();
	}

	async function initMap() {
		mapInstance = createMapProvider();

		try {
			await mapInstance.initMap(mapElement, {
				lat: Number(initialLat),
				lng: Number(initialLng)
			});

			await loadStopsAndAddMarkers(initialLat, initialLng);

			const debouncedLoadMarkers = debounce(async () => {
				const center = mapInstance.getCenter();
				await loadStopsAndAddMarkers(center.lat, center.lng);
			}, 300);

			mapInstance.addListener('dragend', debouncedLoadMarkers);
			mapInstance.addListener('zoom_changed', debouncedLoadMarkers);

			if (browser) {
				window.addEventListener('themeChange', handleThemeChange);
			}
		} catch (error) {
			console.error('Error initializing map:', error);
		}
	}

	async function loadStopsAndAddMarkers(lat, lng) {
		const json = await loadStopsForLocation(lat, lng);
		const newStops = json.data.list;
		routeReference = json.data.references?.routes || [];

		allStops = [...new Map([...allStops, ...newStops].map((stop) => [stop.id, stop])).values()];

		clearAllMarkers();

		if (showRoute && selectedRoute) {
			const stopsToShow = allStops.filter((s) => s.routeIds.includes(selectedRoute.id));
			stopsToShow.forEach((s) => addMarker(s, routeReference));
		} else {
			newStops.forEach((s) => addMarker(s, routeReference));
		}
	}

	function clearAllMarkers() {
		markers.forEach(({ marker, overlay, element }) => {
			mapInstance.removeMarker(marker);

			if (overlay) {
				overlay.setMap(null);
				overlay.draw = () => {};
				overlay.onRemove?.();
			}
			element?.parentNode?.removeChild(element);
		});
		markers = [];
	}

	$: if (stop && mapInstance) {
		// TODO: make sure that these markers are deduped. i.e. we shouldn't
		// show the same stop twice on the map
		if (stop.id != selectedStopID) {
			addMarker(stop);
			mapInstance.setCenter({ lat: stop.lat, lng: stop.lon });
		}
	}

	$: if (showAllStops) {
		clearAllMarkers();
		allStops.forEach((s) => addMarker(s));
	}

	$: if (selectedRoute && showRoute) {
		clearAllMarkers();
		const stopsToShow = allStops.filter((s) => s.routeIds.includes(selectedRoute.id));
		stopsToShow.forEach((s) => addMarker(s));
	} else if (!showRoute || !selectedRoute) {
		clearAllMarkers();
		allStops.forEach((s) => addMarker(s));
	}

	function addMarker(s, routeReference) {
		const container = document.createElement('div');
		document.body.appendChild(container);

		let icon = faBus;

		if (routeReference && routeReference.length > 0) {
			const availableRoutes = s.routeIds
				.map((id) => routeReference.find((r) => r.id === id))
				.filter(Boolean);
			const routeTypes = new Set(availableRoutes.map((r) => r.type));
			const prioritizedType =
				routePriorities.find((type) => routeTypes.has(type)) || RouteType.UNKNOWN;
			icon = prioritizedRouteTypeForDisplay(prioritizedType);
		}

		// TODO: move this into GoogleMapProvider
		new StopMarker({
			target: container,
			props: {
				stop: s,
				icon,
				onClick: () => {
					selectedStopID = s.id;
					dispatch('stopSelected', { stop: s });
				}
			}
		});

		const marker = mapInstance.addMarker({
			position: { lat: s.lat, lng: s.lon },
			icon: icon,
			element: container
		});

		markers.push({ s, marker, element: container });
	}

	function handleThemeChange(event) {
		const { darkMode } = event.detail;
		mapInstance.setTheme(darkMode ? 'dark' : 'light');
	}

	function handleLocationObtained(event) {
		const { latitude, longitude } = event.detail;
		mapInstance.setCenter({ lat: latitude, lng: longitude });
		mapInstance.addUserLocationMarker({ lat: latitude, lng: longitude });
	}

	function handleMapTypeChange(event) {
		mapTypeId = event.detail;
		mapInstance.setMapType(mapTypeId);
	}

	onMount(async () => {
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
		markers.forEach(({ marker, element }) => {
			mapInstance.removeMarker(marker);
			if (element && element.parentNode) {
				element.parentNode.removeChild(element);
			}
		});
	});
</script>

<div class="map-container">
	<div id="map" bind:this={mapElement}></div>

	{#if selectedTrip && showRouteMap}
		<RouteMap map={mapInstance} tripId={selectedTrip.tripId} />
	{/if}

	<LocationButton on:locationObtained={handleLocationObtained} />
	<MapTypeButton {mapTypeId} on:mapTypeChanged={handleMapTypeChange} />
</div>

<style>
	.map-container {
		position: relative;
		height: 100%;
		width: 100%;
		z-index: 1;
	}
	#map {
		height: 100vh;
		width: 100%;
	}
</style>
