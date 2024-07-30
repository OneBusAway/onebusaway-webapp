<script>
	import StopPane from '$components/oba/StopPane.svelte';
	export let data;
	const stop = data.stopData.entry;
	const arrivalsAndDeparturesResponse = data.arrivalsAndDeparturesResponse;
</script>

<div class="mx-auto max-w-5xl px-8 pt-20">
	<StopPane {stop} {arrivalsAndDeparturesResponse} />
</div>
