<script>
	import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	export let stop;
	export let onClick;
	export let icon;
</script>

<button class="custom-marker dark:border-[#5a2c2c]" on:click={onClick}>
	<span class="bus-icon dark:text-white">
		<FontAwesomeIcon {icon} class=" text-black" />
		{#if stop.direction}
			<span class="direction-arrow {stop.direction.toLowerCase()} dark:text-white">
				<FontAwesomeIcon icon={faCaretUp} />
			</span>
		{/if}
	</span>
</button>

<style lang="postcss">
	.custom-marker {
		@apply h-8 w-8 rounded-md;
		@apply bg-white/80 dark:bg-neutral-200;
		@apply border border-2 border-gray-400;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.custom-marker:hover {
		cursor: pointer;
	}

	.bus-icon {
		font-size: 20px;
		color: #000;
	}

	.direction-arrow {
		position: absolute;
		font-size: 20px;
		color: #000;
	}

	.direction-arrow.n {
		top: -18px;
		left: 12px;
		transform: rotate(0deg);
	}
	.direction-arrow.ne {
		top: -15px;
		right: -10px;
		transform: rotate(45deg);
	}
	.direction-arrow.e {
		right: -13px;
		top: 5px;
		transform: rotate(90deg);
	}
	.direction-arrow.se {
		bottom: -15px;
		right: -10px;
		transform: rotate(135deg);
	}
	.direction-arrow.s {
		bottom: -18px;
		left: 12px;
		transform: rotate(180deg);
	}
	.direction-arrow.sw {
		bottom: -15px;
		left: -10px;
		transform: rotate(225deg);
	}
	.direction-arrow.w {
		left: -13px;
		top: 5px;
		transform: rotate(270deg);
	}
	.direction-arrow.nw {
		top: -15px;
		left: -10px;
		transform: rotate(315deg);
	}
</style>
