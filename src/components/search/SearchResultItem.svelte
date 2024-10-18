<script>
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	export let icon = null;
	export let title = null;
	export let subtitle = null;
</script>

<button
	type="button"
	on:click
	class="block flex w-full items-center gap-x-4 rounded-md px-2 py-1 text-left hover:bg-gray-200"
>
	<div class="flex items-center gap-x-4">
		<div
			class="flex h-12 w-12 min-w-12 max-w-12 items-center justify-center rounded-full bg-gray-200"
		>
			<FontAwesomeIcon {icon} class="text-2xl text-gray-800" />
		</div>

		<div>
			<h3 class="text-lg font-semibold text-gray-700">{title}</h3>
			<p class="text-gray-700">{subtitle}</p>
		</div>
	</div>
</button>
