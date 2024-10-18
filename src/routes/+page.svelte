<script>
	import { pushState } from '$app/navigation';
	import Header from '$components/navigation/Header.svelte';
	import SearchPane from '$components/search/SearchPane.svelte';
	import ModalPane from '$components/navigation/ModalPane.svelte';
	import StopPane from '$components/oba/StopPane.svelte';
	import MapContainer from '$components/MapContainer.svelte';

	let stop;
	let selectedTrip = null;
	let showRoute = false;
	let selectedRoute = null;
	let showRouteMap = false;
	let showAllStops = false;

	function stopSelected(event) {
		stop = event.detail.stop;
		pushState(`/stops/${stop.id}`);
	}

	function closePane() {
		stop = null;
		selectedTrip = null;
		selectedRoute = null;
		showRoute = false;
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
</script>

<div class="absolute left-0 right-0 top-0 z-40">
	<Header />

	<div class="ml-4 mt-4 md:w-64">
		<SearchPane />
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

<MapContainer
	{selectedTrip}
	{selectedRoute}
	on:stopSelected={stopSelected}
	{showRoute}
	{showRouteMap}
	{stop}
/>
