<script>
	import GoogleMap from '../components/map/GoogleMap.svelte';
	import ModalPane from '../components/navigation/ModalPane.svelte';
	import StopPane from '../components/oba/StopPane.svelte';

	let stop;

	function stopSelected(event) {
		stop = event.detail.stop;
	}

	function closePane() {
		stop = null;
	}
</script>

{#if stop}
	<ModalPane on:close={closePane}>
		<StopPane {stop} />
	</ModalPane>
{/if}

<GoogleMap on:stopSelected={stopSelected} />
