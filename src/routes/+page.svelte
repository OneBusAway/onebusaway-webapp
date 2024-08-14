<script>
	import GoogleMap from '../components/map/GoogleMap.svelte';
	import ModalPane from '../components/navigation/ModalPane.svelte';
	import StopPane from '../components/oba/StopPane.svelte';

	let stop;
	let selectedTrip = null;
	let showRoute = false;
	let selectedRoute = null;

	function stopSelected(event) {
		stop = event.detail.stop;
	}

	function closePane() {
		stop = null;
		selectedTrip = null;
		selectedRoute = null;
		showRoute = false;
	}

	function tripSelected(event) {
		selectedTrip = event.detail;
		showRoute = true;
		selectedRoute = {
			id: event.detail.routeId,
			shortName: event.detail.routeShortName
		};
	}
</script>

{#if stop}
	<ModalPane on:close={closePane}>
		<StopPane {stop} on:tripSelected={tripSelected} />
	</ModalPane>
{/if}

<GoogleMap {selectedTrip} {selectedRoute} on:stopSelected={stopSelected} {showRoute} />
