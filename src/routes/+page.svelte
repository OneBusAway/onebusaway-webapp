<script>
	import { pushState } from '$app/navigation';
	import Header from '$components/navigation/Header.svelte';
	import SearchPane from '$components/search/SearchPane.svelte';
	import ModalPane from '$components/navigation/ModalPane.svelte';
	import StopPane from '$components/oba/StopPane.svelte';
	import MapContainer from '$components/MapContainer.svelte';
	import RouteModal from '$components/navigation/RouteModal.svelte';
	import { cleanupInfoWindow, cleanupStopMarkers } from '$lib/mapUtils';
	import { MapSource } from '$config/mapSource';

	let stop;
	let selectedTrip = null;
	let showRoute = false;
	let selectedRoute = null;
	let showRouteMap = false;
	let showAllStops = false;
	let showRouteModal;
	let mapProvider = null;
	let mapSource = null;
	let polylines = [];
	let stops = [];

	function stopSelected(event) {
		stop = event.detail.stop;
		pushState(`/stops/${stop.id}`);
	}

	function closePane() {
		if (polylines) {
			clearPolylines();
			cleanupStopMarkers(mapSource);
			cleanupInfoWindow();
		}
		stop = null;
		selectedTrip = null;
		selectedRoute = null;
		showRoute = false;
		showRouteModal = false;
	}

	function tripSelected(event) {
		if (event.detail) {
			selectedTrip = event.detail;
			showRoute = true;
			selectedRoute = {
				id: event.detail.routeId,
				shortName: event.detail.routeShortName
			};
		} else {
			selectedTrip = null;
			showRoute = false;
			selectedRoute = null;
		}
	}

	function handleUpdateRouteMap(event) {
		showRouteMap = event.detail.show;
		showAllStops = !event.detail.show;
	}

	function handleShowAllStops() {
		showAllStops = true;
		showRouteMap = false;
	}

	function handleRouteSelected(event) {
		selectedRoute = event.detail.route;
		polylines = event.detail.polylines;
		stops = event.detail.stops;
		showRouteModal = true;
	}

	function clearPolylines() {
		switch (mapSource) {
			case MapSource.Google: {
				polylines.map((p) => {
					p.setMap(null);
				});
				break;
			}
			case MapSource.OpenStreetMap: {
				polylines.map((p) => {
					mapProvider.removePolyline(p);
				});
				break;
			}
		}

		cleanupStopMarkers(mapSource);
		selectedRoute = null;
	}
</script>

<div class="absolute left-0 right-0 top-0 z-40">
	<Header />

	<div class="ml-4 mt-4 md:w-64">
		<SearchPane
			{mapProvider}
			{mapSource}
			on:routeSelected={handleRouteSelected}
			on:clearResults={clearPolylines}
		/>
	</div>
</div>

{#if stop}
	<ModalPane on:close={closePane} {stop}>
		<StopPane
			{showAllStops}
			{stop}
			on:tripSelected={tripSelected}
			on:updateRouteMap={handleUpdateRouteMap}
			on:showAllStops={handleShowAllStops}
		/>
	</ModalPane>
{/if}

{#if showRouteModal}
	<ModalPane on:close={closePane}>
		<RouteModal {mapProvider} {mapSource} {stops} {selectedRoute} />
	</ModalPane>
{/if}

<MapContainer
	{selectedTrip}
	{selectedRoute}
	on:stopSelected={stopSelected}
	{showRoute}
	{showRouteMap}
	{stop}
	bind:mapProvider
	bind:mapSource
/>
