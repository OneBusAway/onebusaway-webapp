<script>
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faX } from '@fortawesome/free-solid-svg-icons';
	import { createEventDispatcher } from 'svelte';
	import { keybinding } from '$lib/keybinding';
	import ArrivalDeparture from '../ArrivalDeparture.svelte';

	export let stop;
	let arrivalsAndDepartures;
	let loading = false;
	let error;

	const dispatch = createEventDispatcher();

	function closePane() {
		dispatch('closePane');
	}

	async function loadData(stopID) {
		loading = true;
		const response = await fetch(`/api/oba/arrivals-and-departures-for-stop/${stopID}`);
		if (response.ok) {
			const json = await response.json();
			arrivalsAndDepartures = json.data.entry;
		} else {
			error = 'Unable to fetch arrival/departure data';
		}

		loading = false;
	}

	$: (async (s) => {
		await loadData(s.id);
	})(stop);
</script>

<div class="relative rounded-lg bg-[#F3F2F8] p-6 dark:bg-black">
	{#if loading}
		<div
			class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-[#1C1C1E] bg-opacity-80"
		>
			<div class="flex items-center text-white">
				<svg
					class="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				Loading...
			</div>
		</div>
	{/if}

	{#if error}
		<p>{error}</p>
	{/if}

	{#if arrivalsAndDepartures}
		<div>
			<div class="relative">
				<div class="h-36 rounded-lg bg-[#1C1C1E] bg-opacity-80 p-4">
					<h1 class="text-xl font-semibold text-white">{stop.name}</h1>
					<h1 class="text-lg text-white">Stop #{stop.name}</h1>
					<h1 class="text-lg text-white">Routes: {stop.name}</h1>
				</div>
				<div class="absolute -right-4 -top-6">
					<button type="button" on:click={closePane} use:keybinding={{ code: 'Escape' }}>
						<FontAwesomeIcon icon={faX} class="text-black dark:text-white" />
						<span class="sr-only">Close</span>
					</button>
				</div>
			</div>
			<div>
				<h3 class="mb-1 ml-7 mt-4 text-xl font-semibold uppercase text-[#86858B]">
					Arrivals and Departures
				</h3>
			</div>
			<div class="scrollbar-hidden h-96 space-y-2 overflow-y-scroll rounded-lg">
				<div>
					{#each arrivalsAndDepartures.arrivalsAndDepartures as arrival}
						<ArrivalDeparture
							routeShortName={arrival.routeShortName}
							tripHeadsign={arrival.tripHeadsign}
							scheduledArrivalTime={arrival.scheduledArrivalTime}
							predictedArrivalTime={arrival.predictedArrivalTime}
						/>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.scrollbar-hidden {
		scrollbar-width: none;
		-ms-overflow-style: none;
		overflow: -moz-scrollbars-none;
		-webkit-scrollbar: none;
	}
</style>
