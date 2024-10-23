<script>
	import ArrivalDeparture from '../ArrivalDeparture.svelte';
	import { onMount } from 'svelte';
	import TripDetailsModal from '../navigation/TripDetailsModal.svelte';
	import { createEventDispatcher } from 'svelte';

	import '$lib/i18n.js';
	import { t } from 'svelte-i18n';

	export let stop;
	export let arrivalsAndDeparturesResponse = null;
	export let showAllStops = true;

	let arrivalsAndDepartures;
	let loading = false;
	let error;

	let showTripDetails = false;
	let selectedTripDetails = null;
	let interval;

	const dispatch = createEventDispatcher();

	async function loadData(stopID) {
		loading = true;

		const response = await fetch(`/api/oba/arrivals-and-departures-for-stop/${stopID}`);

		if (response.ok) {
			arrivalsAndDeparturesResponse = await response.json();
			arrivalsAndDepartures = arrivalsAndDeparturesResponse.data.entry;
		} else {
			error = 'Unable to fetch arrival/departure data';
		}

		loading = false;
	}

	$: if (showAllStops) {
		showTripDetails = false;
		selectedTripDetails = null;
	}

	$: (async (s, arrDep) => {
		// if the arrivalsAndDeparturesResponse is passed in, use that
		// instead of loading fresh data.
		if (arrDep) {
			arrivalsAndDepartures = arrDep.data.entry;
		} else {
			await loadData(s.id);
		}
	})(stop, arrivalsAndDeparturesResponse);

	onMount(() => {
		interval = setInterval(() => {
			loadData(stop.id);
		}, 30000);

		return () => clearInterval(interval);
	});

	let _routeShortNames = null;
	function routeShortNames() {
		if (!_routeShortNames) {
			_routeShortNames = arrivalsAndDeparturesResponse.data.references.routes
				.filter((r) => stop.routeIds.includes(r.id))
				.map((r) => r.nullSafeShortName)
				.sort();
		}
		return _routeShortNames;
	}
	function handleShowTripDetails(event) {
		selectedTripDetails = {
			...event.detail,
			routeShortName: event.detail.routeShortName,
			tripHeadsign: event.detail.tripHeadsign,
			scheduledArrivalTime: event.detail.scheduledArrivalTime
		};
		showTripDetails = true;
		dispatch('tripSelected', selectedTripDetails);
		dispatch('updateRouteMap', { show: true });
	}

	function handleCloseTripDetailModal() {
		showTripDetails = false;
		dispatch('tripSelected', null);
		dispatch('updateRouteMap', { show: false });
		dispatch('showAllStops');
	}
</script>

<div>
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
				{$t('loading')}...
			</div>
		</div>
	{/if}

	{#if error}
		<p>{error}</p>
	{/if}

	{#if arrivalsAndDepartures}
		<div>
			<div>
				<div class="flex flex-col gap-y-1 rounded-lg bg-[#1C1C1E] bg-opacity-80 p-4">
					<h1 class="h1 mb-0 text-white">{stop.name}</h1>
					<h2 class="h2 mb-0 text-white">{$t('stop')} #{stop.id}</h2>
					{#if routeShortNames()}
						<h2 class="h2 mb-0 text-white">{$t('routes')}: {routeShortNames().join(', ')}</h2>
					{/if}
				</div>
			</div>
			<div>
				<h2 class="h2 ml-4 mt-4">{$t('arrivals_and_departures')}</h2>
			</div>
			<div class="scrollbar-hidden h-96 space-y-2 overflow-y-scroll rounded-lg">
				<div>
					{#each arrivalsAndDepartures.arrivalsAndDepartures as arrival}
						<ArrivalDeparture
							routeShortName={arrival.routeShortName}
							tripHeadsign={arrival.tripHeadsign}
							scheduledArrivalTime={arrival.scheduledArrivalTime}
							predictedArrivalTime={arrival.predictedArrivalTime}
							tripId={arrival.tripId}
							vehicleId={arrival.vehicleId}
							serviceDate={arrival.serviceDate}
							on:showTripDetails={handleShowTripDetails}
						/>
					{/each}
				</div>
			</div>
		</div>
	{/if}

	{#if showTripDetails}
		<TripDetailsModal {stop} {selectedTripDetails} onClose={handleCloseTripDetailModal} />
	{/if}
</div>

<style lang="postcss">
	.scrollbar-hidden {
		scrollbar-width: none;
		-ms-overflow-style: none;
		overflow: -moz-scrollbars-none;
		-webkit-scrollbar: none;
	}
</style>
