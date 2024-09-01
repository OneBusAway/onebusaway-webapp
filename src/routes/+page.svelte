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

	function routeSelected(event) {
		const route = event.detail.route;
		const routeId = route?.id || searchQuery;
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
		console.log('Raw search event:', event);
		searchResults = event.detail;
		console.log('Search results set:', searchResults);
	}

	function closeModal() {
		searchResults = null;
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
	<ModalPane on:close={closeModal}>
		{#if searchResults.stopSearchResults?.list?.length > 0 || searchResults.routeSearchResults?.list?.length > 0}
			<SearchResults
				{searchResults}
				on:routeSelected={routeSelected}
				on:stopSelected={stopSelected}
			/>
		{:else}
			<p class="p-4 text-center">No results found.</p>
		{/if}
	</ModalPane>
{/if}

<GoogleMap
	{selectedTrip}
	{selectedRoute}
	on:stopSelected={stopSelected}
	{showRoute}
	{showRouteMap}
	{stop}
/>
