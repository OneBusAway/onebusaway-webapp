<script>
    import { fly } from 'svelte/transition';
    import GoogleMap from '../components/map/GoogleMap.svelte';
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
    <div
        class="absolute bottom-0 left-0 bg-transparent px-2 shadow-lg z-40 w-full md:max-w-prose"
        in:fly={{ y: 200, duration: 500 }}
        out:fly={{ y: 200, duration: 500 }}>
        <StopPane {stop} on:closePane={closePane} />
    </div>
{/if}

<GoogleMap on:stopSelected={stopSelected} />