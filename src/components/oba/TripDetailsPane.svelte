<script>
	import { onMount, onDestroy } from 'svelte';
	import { faBus, faLocationDot } from '@fortawesome/free-solid-svg-icons';
	import { faSquare } from '@fortawesome/free-regular-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

	export let tripId;
	export let serviceDate = null;

	let tripDetails = null;
	let routeInfo = null;
	let stopInfo = {};
	let error = null;
	let interval;
	let currentStopIndex = -1;
	let busPosition = 0;

	function formatTime(seconds) {
		if (!seconds) return '';
		const date = new Date(seconds * 1000);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	function calculateBusPosition() {
		if (tripDetails && tripDetails.status && tripDetails.status.position) {
			const { lat, lon } = tripDetails.status.position;

			busPosition = tripDetails.schedule.stopTimes.findIndex((stop, index, array) => {
				const nextStop = array[index + 1];
				if (!nextStop) return true;
				const stopLat = stopInfo[stop.stopId].lat;
				const stopLon = stopInfo[stop.stopId].lon;
				const nextStopLat = stopInfo[nextStop.stopId].lat;
				const nextStopLon = stopInfo[nextStop.stopId].lon;
				return (lat >= stopLat && lat < nextStopLat) || (lon >= stopLon && lon < nextStopLon);
			});
		}
	}

	async function loadTripDetails() {
		try {
			let url = `/api/oba/trip-details/${tripId}?includeTrip=true&includeSchedule=true&includeStatus=true`;
			if (serviceDate) {
				url += `&serviceDate=${serviceDate}`;
			}
			const response = await fetch(url);
			if (response.ok) {
				const data = await response.json();
				tripDetails = data.data.entry;

				if (data.data.references && data.data.references.routes) {
					routeInfo = data.data.references.routes.find((route) => route.id === tripDetails.routeId);
				}

				if (data.data.references && data.data.references.stops) {
					stopInfo = data.data.references.stops.reduce((acc, stop) => {
						acc[stop.id] = stop;
						return acc;
					}, {});
				}

				if (tripDetails.status && tripDetails.status.closestStop) {
					currentStopIndex = tripDetails.schedule.stopTimes.findIndex(
						(stop) => stop.stopId === tripDetails.status.closestStop.stopId
					);
				}

				calculateBusPosition();

				console.log('Trip details:', tripDetails);
				console.log('Route info:', routeInfo);
				console.log('Stop info:', stopInfo);
				console.log('Current stop index:', currentStopIndex);
				console.log('Bus position:', busPosition);
			} else {
				error = 'Unable to fetch trip details';
			}
		} catch (err) {
			console.error('Error fetching trip details:', err);
			error = 'Error fetching trip details';
		}
	}

	onMount(() => {
		loadTripDetails();
		interval = setInterval(loadTripDetails, 30000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="trip-details-pane">
	{#if error}
		<p>{error}</p>
	{:else if tripDetails}
		<h2>
			{#if routeInfo}
				Route {routeInfo.shortName} -
			{/if}
		</h2>
		{#if tripDetails.schedule && tripDetails.schedule.stopTimes && tripDetails.schedule.stopTimes.length > 0}
			<div class="relative">
				<div class="absolute bottom-0 left-5 top-0 w-0.5 bg-green-500"></div>
				{#each tripDetails.schedule.stopTimes as stop, index}
					<div class="relative mb-4 flex items-center">
						<div class="relative z-10 flex h-12 w-12 items-center justify-center">
							<FontAwesomeIcon
								icon={faSquare}
								class="bg-white text-3xl text-green-500 dark:bg-black"
							/>
							{#if index === busPosition}
                                <FontAwesomeIcon icon={faBus} class="bg-white dark:bg-black absolute text-sm text-green-500" />
                            {/if}
                            {#if index === currentStopIndex}
                                <FontAwesomeIcon icon={faLocationDot} class="bg-white dark:bg-black absolute text-sm text-blue-500" />
                            {/if}
						</div>
						<div class="ml-4 flex w-full items-center justify-between">
							<div class="text-md font-semibold text-[#000000] dark:text-white">
								{stopInfo[stop.stopId] ? stopInfo[stop.stopId].name : stop.stopId}
							</div>
							<div class="text-sm text-[#86858B]">{formatTime(stop.arrivalTime)}</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<p class="text-black dark:text-white">No stop times available for this trip.</p>
		{/if}
	{:else}
		<p class="text-black dark:text-white">Loading trip details...</p>
	{/if}
</div>
