<script>
	import GoogleMap from '../components/map/GoogleMap.svelte';
	import ModalPane from '../components/navigation/ModalPane.svelte';
	import StopPane from '../components/oba/StopPane.svelte';

	let stop;
	let selectedTrip = null;

	function stopSelected(event) {
		stop = event.detail.stop;
	}

	function closePane() {
		stop = null;
		selectedTrip = null;
	}

	function tripSelected(event) {
        selectedTrip = event.detail;
    }

</script>

{#if stop}
	<ModalPane on:close={closePane}>
		<StopPane {stop} on:tripSelected={tripSelected} />
	</ModalPane>
{/if}

<GoogleMap {selectedTrip} on:stopSelected={stopSelected} />
