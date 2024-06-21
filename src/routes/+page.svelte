<script>
	import GoogleMap from '../components/map/GoogleMap.svelte'

	function stopSelected(event) {
		const stop = event.detail.stop;
		alert(JSON.stringify(stop));
	}
</script>

<GoogleMap on:stopSelected={stopSelected} />