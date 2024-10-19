<script>
	import { browser } from '$app/environment';
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import {
		PUBLIC_OBA_REGION_CENTER_LAT as initialLat,
		PUBLIC_OBA_REGION_CENTER_LNG as initialLng
	} from '$env/static/public';

	import { debounce } from '$lib/utils';
	import LocationButton from '$lib/LocationButton/LocationButton.svelte';
	import RouteMap from './RouteMap.svelte';

	import MapTypeButton from '$lib/MapTypeButton/MapTypeButton.svelte';
	import { faBus } from '@fortawesome/free-solid-svg-icons';
	import { RouteType, routePriorities, prioritizedRouteTypeForDisplay } from '$config/routeConfig';

	export let selectedTrip = null;
	export let selectedRoute = null;
	export let showRoute = false;
	export let showRouteMap = false;
	export let showAllStops = true;
	export let stop = null;
	export let mapProvider = null;
	export let mapSource = null;
	let selectedStopID = null;

	const dispatch = createEventDispatcher();

	let mapInstance = null;
	let mapTypeId = 'roadmap';
	let mapElement;

	let markers = [];
	let allStops = [];
	let routeReference = [];
	let stopsCache = new Map();

	function cacheKey(zoomLevel, boundingBox) {
		const roundedBox = {
			north: boundingBox.north.toFixed(4),
			south: boundingBox.south.toFixed(4),
			east: boundingBox.east.toFixed(4),
			west: boundingBox.west.toFixed(4)
		};

		return `${roundedBox.north}_${roundedBox.south}_${roundedBox.east}_${roundedBox.west}_${zoomLevel}`;
	}

	function getBoundingBox() {
		if (!mapProvider) {
			throw new Error('Map provider is not initialized');
		}
		return mapProvider.getBoundingBox();
	}

	async function loadStopsForLocation(lat, lng, zoomLevel, firstCall = false) {
		if (firstCall) {
			const response = await fetch(`/api/oba/stops-for-location?lat=${lat}&lng=${lng}&radius=2500`);
			if (!response.ok) {
				throw new Error('Failed to fetch locations');
			}
			return await response.json();
		}

		const boundingBox = getBoundingBox();
		const key = cacheKey(zoomLevel, boundingBox);

		if (stopsCache.has(key)) {
			return stopsCache.get(key);
		}

		const response = await fetch(
			`/api/oba/stops-for-location?lat=${lat}&lng=${lng}&latSpan=${boundingBox.north - boundingBox.south}&lngSpan=${boundingBox.east - boundingBox.west}&radius=1000`
		);

		if (!response.ok) {
			throw new Error('Failed to fetch locations');
		}

		const stopsForLocation = await response.json();
		stopsCache.set(key, stopsForLocation);

		return stopsForLocation;
	}

	async function initMap() {
		try {
			await mapProvider.initMap(mapElement, {
				lat: Number(initialLat),
				lng: Number(initialLng)
			});

			mapInstance = mapProvider;

			await loadStopsAndAddMarkers(initialLat, initialLng, true);

			const debouncedLoadMarkers = debounce(async () => {
				const center = mapInstance.getCenter();
				const zoomLevel = mapInstance.map.getZoom();

				await loadStopsAndAddMarkers(center.lat, center.lng, false, zoomLevel);
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

	async function loadStopsAndAddMarkers(lat, lng, firstCall = false, zoomLevel = 15) {
		const stopsData = await loadStopsForLocation(lat, lng, zoomLevel, firstCall);
		const newStops = stopsData.data.list;
		routeReference = stopsData.data.references.routes || [];

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
		markers.forEach((markerObj) => {
			mapInstance.removeMarker(markerObj);
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
		if (!mapInstance) {
			console.error('Map not initialized yet');
			return;
		}

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

		const markerObj = mapInstance.addMarker({
			position: { lat: s.lat, lng: s.lon },
			icon: icon,
			stop: s,
			onClick: () => {
				selectedStopID = s.id;
				dispatch('stopSelected', { stop: s });
			}
		});

		markers.push(markerObj);
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
		markers.forEach(({ markerObj, element }) => {
			mapProvider.removeMarker(markerObj);
			if (element && element.parentNode) {
				element.parentNode.removeChild(element);
			}
		});
	});
</script>

<div class="map-container">
	<div id="map" bind:this={mapElement}></div>

	{#if selectedTrip && showRouteMap}
		<RouteMap mapProvider={mapInstance} {mapSource} tripId={selectedTrip.tripId} />
	{/if}
</div>

<div class="controls">
	<LocationButton on:locationObtained={handleLocationObtained} />
	<!-- TODO: MAKE THE MAP TYPE WORK IN OSM MAP-->
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
