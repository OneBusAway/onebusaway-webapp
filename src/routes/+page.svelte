<script>
	import { pushState } from '$app/navigation';
	import MapView from '../components/map/MapView.svelte';
	import Header from '../components/navigation/Header.svelte';
	import ModalPane from '../components/navigation/ModalPane.svelte';
	import StopPane from '../components/oba/StopPane.svelte';
	import SearchResults from '../components/search/SearchResults.svelte';

	let stop;
	let selectedTrip = null;
	let showRoute = false;
	let selectedRoute = null;
	let showRouteMap = false;
	let showAllStops = false;
	let searchResults = null;

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

	function routeSelected(event) {
		const route = event.detail.route;
		const routeId = route?.id;
		alert(`TODO: show route ${routeId}`);
		closeModal();
	}

	function handleUpdateRouteMap(event) {
		showRouteMap = event.detail.show;
		showAllStops = !event.detail.show;
	}

	function handleShowAllStops() {
		showAllStops = true;
		showRouteMap = false;
	}
	function handleSearch(event) {
		searchResults = event.detail;
	}

	function closeModal() {
		searchResults = null;
	}
</script>

<div class="absolute left-0 right-0 top-0 z-40">
	<Header on:searchResults={handleSearch} />
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

{#if searchResults}
	<ModalPane on:close={closeModal}>
		{#if searchResults.stopSearchResults?.list?.length > 0 || searchResults.routeSearchResults?.list?.length > 0}
			<SearchResults
				{searchResults}
				on:routeSelected={routeSelected}
				on:stopSelected={stopSelected}
			/>
		{:else}
			<p class="p-4 text-center dark:text-gray-200">No results found.</p>
		{/if}
	</ModalPane>
{/if}

<MapView
	{selectedTrip}
	{selectedRoute}
	on:stopSelected={stopSelected}
	{showRoute}
	{showRouteMap}
	{stop}
/>
