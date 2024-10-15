<script>
	export let stopName;
	export let arrivalTime;
</script>

<div class="transform rounded-lg bg-white p-4 shadow-lg">
	<h3 class="text-xl font-bold text-gray-900">{stopName}</h3>
	<p class="mt-2 flex items-center text-gray-700">
		<span class="mr-2 rounded-md bg-purple-600 px-2 py-1 text-white">Arrival time:</span>
		<span
			>{new Date(arrivalTime * 1000).toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit'
			})}</span
		>
	</p>
</div>
