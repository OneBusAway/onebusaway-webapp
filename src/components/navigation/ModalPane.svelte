<script>
	import { fly } from 'svelte/transition';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faX } from '@fortawesome/free-solid-svg-icons';
	import { keybinding } from '$lib/keybinding';
	import { createEventDispatcher } from 'svelte';
	import { pushState } from '$app/navigation';

	export let stop = null;

	const dispatch = createEventDispatcher();

	function closePane() {
		pushState('/');
		dispatch('close');
	}
</script>

<div
	class="modal-pane scroll-hidden"
	style={stop ? 'z-index: 40' : 'z-index: 20'}
	in:fly={{ y: 200, duration: 500 }}
	out:fly={{ y: 200, duration: 500 }}
>
	<div class="py-1 text-right">
		<button
			type="button"
			on:click={closePane}
			use:keybinding={{ code: 'Escape' }}
			class="close-button"
		>
			<FontAwesomeIcon icon={faX} class="font-black text-black dark:text-white" />
			<span class="sr-only">Close</span>
		</button>
	</div>

	<slot></slot>
</div>

<style lang="postcss">
	.modal-pane {
		@apply absolute bottom-0 left-0 max-h-[40rem] w-full overflow-y-scroll bg-transparent px-2 shadow-lg md:max-w-prose;
		@apply rounded-lg border-b-[1px] border-[#C6C6C8] bg-[#F3F2F8] dark:border-[1px] dark:border-[#C6C6C8] dark:border-opacity-15 dark:bg-black;
	}

	.close-button {
		@apply rounded px-4 py-2;
		@apply transition duration-300 ease-in-out hover:bg-neutral-200 dark:hover:bg-neutral-200/50;
	}
</style>
