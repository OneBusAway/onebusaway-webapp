<script>
	import StopItem from '$components/StopItem.svelte';
	import { MapSource } from '$config/mapSource';

	export let selectedRoute;
	export let stops;
	export let mapProvider;
	export let mapSource;

	function handleStopItemClick(event) {
		const { stop } = event.detail;

		switch (mapSource) {
			case MapSource.Google: {
				mapProvider.map.panTo({ lat: stop.lat, lng: stop.lon });
				mapProvider.map.setZoom(20);
				break;
			}

			case MapSource.OpenStreetMap: {
				mapProvider.map.panTo([stop.lat, stop.lon]);
				mapProvider.map.setZoom(20);
				break;
			}
		}
	}
</script>

{#if stops && selectedRoute}
	<div>
		<div>
			<div class="h-36 rounded-lg bg-[#1C1C1E] bg-opacity-80 p-4">
				<h1 class="mb-1 text-2xl font-bold text-white">Route: {selectedRoute.shortName}</h1>
				<h2 class="mb-1 text-xl text-white">{selectedRoute.longName}</h2>
			</div>
		</div>
		<div>
			<h2 class="ml-4 mt-4 text-xl text-white">Stops</h2>
		</div>
		<div class="scrollbar-hidden h-96 space-y-2 overflow-y-scroll rounded-lg">
			<div>
				{#each stops as stop}
					<StopItem {stop} on:stopClick={handleStopItemClick} />
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	.scrollbar-hidden {
		scrollbar-width: none;
		-ms-overflow-style: none;
		overflow: -moz-scrollbars-none;
		-webkit-scrollbar: none;
	}
</style>
