<script>
	import StopPane from '$components/oba/StopPane.svelte';
	export let data;
	const stop = data.stopData.entry;
	const arrivalsAndDeparturesResponse = data.arrivalsAndDeparturesResponse;
</script>

<div class='pt-20 px-8 max-w-5xl mx-auto'>
	<StopPane {stop} {arrivalsAndDeparturesResponse} />
</div>
