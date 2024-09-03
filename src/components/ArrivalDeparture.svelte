<script>
	export let routeShortName;
	export let tripHeadsign;
	export let scheduledArrivalTime;
	export let predictedArrivalTime;
	export let tripId;
	export let vehicleId;
	export let serviceDate;
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function formatTime(time) {
		const date = new Date(time);
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	function getArrivalStatus(predictedTime, scheduledTime) {
		const now = new Date();
		const predicted = new Date(predictedTime);
		const scheduled = new Date(scheduledTime);

		const predictedDiff = predicted - now;
		const scheduledDiff = scheduled - now;

		if (predictedTime == 0) {
			return { status: 'scheduled', text: 'Scheduled/not real-time', color: 'text-gray-500' };
		} else if (predictedDiff <= 0) {
			return {
				status: 'early',
				text: 'arrives ' + Math.abs(Math.floor(predictedDiff / 60000)) + ' min early',
				color: 'text-red-500'
			};
		} else if (scheduledDiff <= 0) {
			return { status: 'on time', text: 'arrives on time', color: 'text-green-500' };
		} else {
			return {
				status: 'late',
				text: 'arrives ' + Math.floor(predictedDiff / 60000) + ' min late',
				color: 'text-blue-500'
			};
		}
	}

	function calculateTimeToReach(predictedTime, scheduledTime) {
		const now = new Date();
		const predicted = new Date(predictedTime);
		const scheduled = new Date(scheduledTime);

		const predictedDiff = predicted - now;

		const chosenTime = predictedDiff >= 0 ? predicted : scheduled;

		return `${Math.floor((chosenTime - now) / 60000)}m`;
	}

	function handleTripDetail() {
		dispatch('showTripDetails', {
			tripId,
			vehicleId,
			serviceDate,
			routeShortName,
			tripHeadsign,
			scheduledArrivalTime,
			timeToReach: calculateTimeToReach(predictedArrivalTime, scheduledArrivalTime),
			arrivalStatus: getArrivalStatus(predictedArrivalTime, scheduledArrivalTime)
		});
	}
</script>

<button
	on:click={handleTripDetail}
	class="flex h-auto w-full items-center justify-between border-b-[1px] border-[#C6C6C8] bg-[#ffffff] p-4 hover:cursor-pointer hover:bg-[#e3e3e3] dark:border-[#313135] dark:bg-[#1c1c1c] hover:dark:bg-[#363636]"
>
	<div class="flex flex-col gap-1">
		<p class="text-left text-xl font-semibold text-black dark:text-white">
			{routeShortName} - {tripHeadsign}
		</p>
		<p class="text-left font-semibold text-black dark:text-white">
			<span class="text-md">{formatTime(scheduledArrivalTime)}</span> -
			<span class={getArrivalStatus(predictedArrivalTime, scheduledArrivalTime).color}>
				{getArrivalStatus(predictedArrivalTime, scheduledArrivalTime).text}
			</span>
		</p>
	</div>
	<div>
		<p class="text-lg font-semibold text-black dark:text-white">
			{calculateTimeToReach(predictedArrivalTime, scheduledArrivalTime)}
		</p>
	</div>
</button>
