<script>
    import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome'
	import { faX } from '@fortawesome/free-solid-svg-icons'
    import { createEventDispatcher } from 'svelte';

    export let stop;
    let arrivalsAndDepartures;
    let loading = false;
    let error;

    const dispatch = createEventDispatcher();

    function closePane() {
        dispatch('closePane');
    }

    async function loadData(stopID) {
        loading = true;
        const response = await fetch(`/api/oba/arrivals-and-departures-for-stop/${stopID}`);
        if (response.ok) {
            const json = await response.json();
            arrivalsAndDepartures = json.data.entry;
        }
        else {
            error = "Unable to fetch arrival/departure data";
        }

        loading = false;
    }

    $: (async (s) => {
       await loadData(s.id);
    })(stop);
</script>

{#if loading}
    <p>Loading...</p>
{/if}

{#if error}
    <p>{error}</p>
{/if}

{#if arrivalsAndDepartures}
    <div>
        <div class='flex'>
            <div class='flex-1'>
                <h1 class='font-semibold text-2xl'>{stop.name}</h1>
            </div>
            <div class='flex-none'>
                <button type='button' on:click={closePane}>
                    <FontAwesomeIcon icon={faX} />
                    <span class='sr-only'>Close</span>
                </button>
            </div>
        </div>
        <textarea class='w-full h-96'>
            {JSON.stringify(arrivalsAndDepartures)}
        </textarea>
    </div>
{/if}