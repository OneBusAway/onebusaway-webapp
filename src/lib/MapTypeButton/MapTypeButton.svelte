<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let mapTypeId = 'roadmap';

	const mapTypes = ['roadmap', 'satellite', 'hybrid', 'terrain'];

	function cycleMapType() {
		const currentIndex = mapTypes.indexOf(mapTypeId);
		const nextIndex = (currentIndex + 1) % mapTypes.length;
		mapTypeId = mapTypes[nextIndex];
		dispatch('mapTypeChanged', mapTypeId);
	}

	function getMapTypeIcon(type) {
		switch (type) {
			case 'roadmap':
				return '🗺️';
			case 'satellite':
				return '🛰️';
			case 'hybrid':
				return '🌎';
			case 'terrain':
				return '⛰️';
			default:
				return '🗺️';
		}
	}
</script>

<button class="map-type-button" on:click={cycleMapType}>
	{getMapTypeIcon(mapTypeId)}
</button>

<style>
	.map-type-button {
		background-color: #fff;
		border-radius: 2px;
		box-shadow: 0 1px 4px -1px rgba(0, 0, 0, 0.3);
		margin: 10px;
		font-size: 25px;
		color: #666;
		overflow: hidden;
		height: 40px;
		width: 40px;
		position: absolute;
		bottom: 5.8em;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.map-type-button:hover {
		background-color: #f0f0f0;
	}
</style>
