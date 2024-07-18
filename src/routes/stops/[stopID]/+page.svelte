<script context="module">
	import StopPane from '../../../components/oba/StopPane.svelte';

	export async function load({ params }) {
		const stopID = params.stopID;
		const response = await fetch(`/api/oba/stops/${stopID}`);

		if (!response.ok) {
			return {
				status: response.status,
				error: new Error('Failed to fetch stop data')
			};
		}

		const stopData = await response.json();
		return {
			props: {
				stopData
			}
		};
	}
</script>

<script>
	export let stopData;
</script>

<StopPane {stopData} />
