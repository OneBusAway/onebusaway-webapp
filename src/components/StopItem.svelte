<script>
	import { createEventDispatcher } from 'svelte';
	export let stop;
	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch('stopClick', { stop });
	}
</script>

<button
	type="button"
	class="stop-item dark flex w-full items-center justify-between border-b border-gray-200 p-4 text-left hover:bg-[#e9e9e9] focus:outline-none dark:bg-[##000000] hover:dark:bg-[#363636]"
	on:click={handleClick}
>
	<div class="text-lg font-semibold text-[#000000] dark:text-white">
		{stop.name}
	</div>
	<div class="text-md text-[#86858B]">
		{stop.code}
	</div>
</button>
