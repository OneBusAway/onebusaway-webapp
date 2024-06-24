<script>
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faX } from '@fortawesome/free-solid-svg-icons';
	import { createEventDispatcher } from 'svelte';
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
			console.log(arrivalsAndDepartures);
		} else {
			error = 'Unable to fetch arrival/departure data';
		}

		loading = false;
	}

	$: (async (s) => {
		await loadData(s.id);
	})(stop);
</script>

{#if loading}
	<p>Loading...</p>
{/if}

{#if error}
	<p>{error}</p>
{/if}

{#if arrivalsAndDepartures}
	<div class="bg-[#F3F2F8] p-4">
		<div class="relative">
			<div class="p-4 h-36 bg-[#1C1C1E] bg-opacity-80 rounded-lg">
				<h1 class="text-xl font-semibold text-white">{stop.name}</h1>
				<h1 class="text-lg text-white">Stop #{stop.name}</h1>
				<h1 class="text-lg text-white">Routes: {stop.name}</h1>
			</div>
			<div class="absolute -top-6 -right-5">
				<button type="button" on:click={closePane}>
					<FontAwesomeIcon icon={faX} />
					<span class="sr-only">Close</span>
				</button>
			</div>
		</div>
		<div>
			<h3 class="ml-7 mt-2 mb-1 text-xl font-semibold text-[#86858B] uppercase">Arrivals and Departures</h3>
		</div>
		<div class="h-96 space-y-2 overflow-y-scroll scrollbar-hidden">
			<div class="-space-y-3">
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

<style>
    .scrollbar-hidden {
        scrollbar-width: none;
        -ms-overflow-style: none; 
        overflow: -moz-scrollbars-none; 
        -webkit-scrollbar: none; 
    }
</style>
