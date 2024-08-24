<script>
	export let results;
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleStopClick(stop) {
		dispatch('stopSelected', stop);
	}

	function handleRouteClick(route) {
		alert(`TODO: show route ${route.id}`);
	}
</script>

<div class="p-4">
	<h2 class="mb-4 text-xl font-bold">Search Results</h2>

	<h3 class="mb-2 text-lg font-semibold">Stops</h3>
	{#if results.stopSearchResults.length > 0}
		<ul>
			{#each results.stopSearchResults as stop}
				<li>
					<button on:click={() => handleStopClick(stop)} class="text-blue-500 hover:underline">
						{stop.name}
					</button>
				</li>
			{/each}
		</ul>
	{:else}
		<p>No stops found.</p>
	{/if}

	<h3 class="mt-4 mb-2 text-lg font-semibold">Routes</h3>
	{#if results.routeSearchResults.length > 0}
		<ul>
			{#each results.routeSearchResults as route}
				<li>
					<button on:click={() => handleRouteClick(route)} class="text-blue-500 hover:underline">
						{route.shortName} - {route.longName}
					</button>
				</li>
			{/each}
		</ul>
	{:else}
		<p>No routes found.</p>
	{/if}
</div>
