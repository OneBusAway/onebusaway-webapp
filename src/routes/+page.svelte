<script>
	import GoogleMap from '../components/map/GoogleMap.svelte';
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

	function handleSearch(event) {
		searchResults = event.detail;
	}
</script>

<Header on:searchResults={handleSearch} />

{#if stop}
	<ModalPane on:close={closePane}>
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
	<ModalPane on:close={closePane}>
		<SearchResults results={searchResults} />
	</ModalPane>
{/if}

<GoogleMap
	{selectedTrip}
	{selectedRoute}
	on:stopSelected={stopSelected}
	{showRoute}
	{showRouteMap}
/>
