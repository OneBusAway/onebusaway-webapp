<script>
	export let searchResults = null;
	import { createEventDispatcher } from 'svelte';
	import { compassDirection } from '$lib/formatters';

	const dispatch = createEventDispatcher();

	function handleStopClick(stop) {
		dispatch('stopSelected', { stop });
	}

	function handleRouteClick(route) {
		alert(`TODO: show route ${route.id}`);
	}
</script>

<div class="p-2">
	<h2 class="h2">Search Results</h2>

	<h3 class="h3">Routes</h3>
	{#if searchResults?.routeSearchResults?.list?.length > 0}
		<ul class="overflow-hidden rounded-lg">
			{#each searchResults.routeSearchResults.list as route}
				<li>
					<button
						on:click={() => handleRouteClick(route)}
						class="flex h-auto w-full items-center justify-between border-b-[1px] border-[#C6C6C8] bg-[#ffffff] p-4 hover:cursor-pointer hover:bg-[#e3e3e3] dark:border-[#313135] dark:bg-[#1c1c1c] dark:text-white hover:dark:bg-[#363636]"
					>
						{route.name || `Route ${route.id}`}
					</button>
				</li>
			{/each}
		</ul>
	{:else}
		<p>No routes found.</p>
	{/if}

	<h3 class="h3">Stops</h3>
	{#if searchResults?.stopSearchResults?.list?.length > 0}
		<ul class="overflow-hidden rounded-lg">
			{#each searchResults.stopSearchResults.list as stop}
				<li>
					<button
						on:click={() => handleStopClick(stop)}
						class="flex h-auto w-full items-center justify-between border-b-[1px] border-[#C6C6C8] bg-[#ffffff] p-4 hover:cursor-pointer hover:bg-[#e3e3e3] dark:border-[#313135] dark:bg-[#1c1c1c] dark:text-white hover:dark:bg-[#363636]"
					>
						{stop.name} ({compassDirection(stop.direction)})
					</button>
				</li>
			{/each}
		</ul>
	{:else}
		<p>No stops found.</p>
	{/if}
</div>
