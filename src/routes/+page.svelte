<script>
	import { createEventDispatcher } from 'svelte';
	import GoogleMap from '../components/map/GoogleMap.svelte';
	import ModalPane from '../components/navigation/ModalPane.svelte';
	import StopPane from '../components/oba/StopPane.svelte';
	import RouteMap from '../components/map/RouteMap.svelte';

	let stop;
	let map = null;
	let selectedTrip = null;

	const dispatch = createEventDispatcher();

	function stopSelected(event) {
		stop = event.detail.stop;
	}

	function closePane() {
		stop = null;
	}

	function handleTripSelected(event) {
        selectedTrip = event.detail;
		console.log('selectedTrip:', selectedTrip);
        dispatch('tripSelected', { tripId: selectedTrip.tripId, shapeId: selectedTrip.shapeId });
    }

</script>

{#if stop}
	<ModalPane on:close={closePane}>
		<StopPane {stop} on:tripSelected={handleTripSelected} />
	</ModalPane>
{/if}

<GoogleMap on:stopSelected={stopSelected} {selectedTrip} />

{#if selectedTrip}
    <RouteMap {map} tripId={selectedTrip.tripId} shapeId={selectedTrip.shapeId} />
{/if}