<script>
	import SearchField from '$components/search/SearchField.svelte';
	import SearchResultItem from '$components/search/SearchResultItem.svelte';
	import { createEventDispatcher } from 'svelte';
	import { compassDirection } from '$lib/formatters';

	import { prioritizedRouteTypeForDisplay } from '$config/routeConfig';

	import { faMapPin, faSignsPost } from '@fortawesome/free-solid-svg-icons';

	const dispatch = createEventDispatcher();

	let routes = null;
	let stops = null;
	let location = null;
	let query = null;

	function handleLocationClick(location) {
		const lat = location.geometry.location.lat;
		const lng = location.geometry.location.lng;
		alert(`TODO: show location ${lat}, ${lng}`);
		dispatch('locationSelected', { location });
	}

	function handleStopClick(stop) {
		alert(`TODO: show stop ${stop.id}`);
		dispatch('stopSelected', { stop });
	}

	function handleRouteClick(route) {
		alert(`TODO: show route ${route.id}`);
		dispatch('routeSelected', { route });
	}

	function handleSearchResults(results) {
		routes = results.detail.routes;
		stops = results.detail.stops;
		location = results.detail.location;
		query = results.detail.query;
	}

	function clearResults() {
		routes = null;
		stops = null;
		location = null;
		query = null;
	}
</script>

<div
	class="bg-blur-sm flex w-96 justify-between rounded-lg border-gray-500 bg-white/90 px-4 shadow-lg dark:bg-black dark:text-white"
>
	<div class="flex w-full flex-col gap-y-4 py-4">
		<SearchField value={query} on:searchResults={handleSearchResults} />

		{#if query}
			<p class="text-sm text-gray-700 dark:text-gray-400">
				Search results for "{query}".
				<button type="button" on:click={clearResults} class="text-blue-600 hover:underline">
					Clear results
				</button>
			</p>
		{/if}

		{#if location}
			<SearchResultItem
				on:click={handleLocationClick(location)}
				title={location.formatted_address}
				icon={faMapPin}
				subtitle={location.types.join(', ')}
			/>
		{/if}

		{#if routes?.length > 0}
			{#each routes as route}
				<SearchResultItem
					on:click={handleRouteClick(route)}
					icon={prioritizedRouteTypeForDisplay(route.type)}
					title={`Route ${route.nullSafeShortName || route.id}`}
					subtitle={route.description}
				/>
			{/each}
		{/if}

		{#if stops?.length > 0}
			{#each stops as stop}
				<SearchResultItem
					on:click={handleStopClick(stop)}
					icon={faSignsPost}
					title={stop.name}
					subtitle={`${compassDirection(stop.direction)}; Code: ${stop.code}`}
				/>
			{/each}
		{/if}
	</div>
</div>
