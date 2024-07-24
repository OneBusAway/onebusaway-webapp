<script>
	import ArrivalDeparture from '../ArrivalDeparture.svelte';
	import TripDetailsPane from './TripDetailsPane.svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faX, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

	export let stop;
	export let arrivalsAndDeparturesResponse = null;
	let arrivalsAndDepartures;
	let loading = false;
	let error;

	let showTripDetails = false;
	let selectedTripDetails = null;

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

	$: (async (s, arrDep) => {
		// if the arrivalsAndDeparturesResponse is passed in, use that
		// instead of loading fresh data.
		if (arrDep) {
			arrivalsAndDepartures = arrDep.data.entry;
		} else {
			await loadData(s.id);
		}
	})(stop, arrivalsAndDeparturesResponse);

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
				Loading...
			</div>
		</div>
	{/if}

	{#if error}
		<p>{error}</p>
	{/if}

	{#if arrivalsAndDepartures}
		<div>
			<div>
				<div class="h-36 rounded-lg bg-[#1C1C1E] bg-opacity-80 p-4">
					<h1 class="text-xl font-semibold text-white">{stop.name}</h1>
					<h1 class="text-lg text-white">Stop #{stop.id}</h1>
					{#if routeShortNames()}
						<h1 class="text-lg text-white">Routes: {routeShortNames().join(', ')}</h1>
					{/if}
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
		<div class="trip-details-modal scrollbar-hidden">
			<div class="py-1 text-right">
				<button type="button" on:click={() => (showTripDetails = false)} class="close-button">
					<FontAwesomeIcon icon={faArrowLeft} class="font-black text-black dark:text-white" />
					<span class="sr-only">Back</span>
				</button>
			</div>
			<div
				class="flex items-center justify-between border-b-[1px] border-[#C6C6C8] bg-white px-4 py-2 dark:border-[#313135] dark:bg-gray-800"
			>
				<div>
					<h2 class="text-lg font-semibold">
						{selectedTripDetails.routeShortName} - {selectedTripDetails.tripHeadsign}
					</h2>
					<p class="text-sm font-semibold text-gray-600 dark:text-gray-400">
						{new Date(selectedTripDetails.scheduledArrivalTime).toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit'
						})} -
						<span class={selectedTripDetails.arrivalStatus.color}>
							{selectedTripDetails.arrivalStatus.text}
						</span>
					</p>
				</div>
				<p class={`mt-1 text-sm ${selectedTripDetails.arrivalStatus.color}`}>
					{selectedTripDetails.timeToReach}
				</p>
			</div>
			<div class="px-4 py-2">
				<TripDetailsPane
					tripId={selectedTripDetails.tripId}
					vehicleId={selectedTripDetails.vehicleId}
					serviceDate={selectedTripDetails.serviceDate}
				/>
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	.scrollbar-hidden {
		scrollbar-width: none;
		-ms-overflow-style: none;
		overflow: -moz-scrollbars-none;
		-webkit-scrollbar: none;
	}
	.trip-details-modal {
		@apply absolute bottom-0 left-0 z-40 h-full w-full overflow-y-scroll rounded-lg bg-white px-2 shadow-lg md:max-w-prose;
		@apply rounded-lg border-b-[1px] border-[#C6C6C8] bg-white p-4 shadow-lg hover:cursor-pointer dark:bg-black;
	}
	.close-button {
		@apply rounded px-4 py-2;
		@apply transition duration-300 ease-in-out hover:bg-neutral-200 dark:hover:bg-neutral-200/50;
	}
</style>
