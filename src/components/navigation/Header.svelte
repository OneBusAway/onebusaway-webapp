<script>
	import {
		PUBLIC_OBA_REGION_NAME,
		PUBLIC_OBA_LOGO_URL,
		PUBLIC_OBA_SEARCH_ENABLED
	} from '$env/static/public';
	import ThemeSwitcher from '$lib/ThemeSwitch/ThemeSwitcher.svelte';
	import { createEventDispatcher } from 'svelte';
	import { debounce } from '$lib/utils';

	const dispatch = createEventDispatcher();

	let searchInput = '';

	const debouncedSearch = debounce(async () => {
		if (searchInput.length > 2) {
			try {
				const response = await fetch(`/api/oba/search?query=${encodeURIComponent(searchInput)}`);
				const results = await response.json();
				console.log('Route results:', results.routeSearchResults);
				console.log('Stop results:', results.stopSearchResults);
				dispatch('searchResults', results);
			} catch (error) {
				console.error('Error fetching search results:', error);
			}
		}
	}, 300);

	$: if (searchInput) debouncedSearch();
</script>

<div
	class="bg-blur-md flex items-center justify-between border-b border-neutral-300 bg-white/80 px-4 dark:bg-black dark:text-white"
>
	<div class="flex items-center justify-center gap-4 px-2 py-2">
		<div>
			<a href="/">
				<img src={PUBLIC_OBA_LOGO_URL} alt={PUBLIC_OBA_REGION_NAME} class="h-10 rounded-sm" />
			</a>
		</div>
		{#if PUBLIC_OBA_SEARCH_ENABLED === 'true'}
			<div class="mx-auto max-w-md">
				<label
					for="default-search"
					class="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white">Search</label
				>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
						<svg
							class="h-4 w-4 text-gray-500 dark:text-gray-400"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 20 20"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
							/>
						</svg>
					</div>
					<input
						type="search"
						id="search"
						class="block w-full rounded-full border border-gray-300 bg-gray-50 p-2 ps-10 text-sm text-gray-900 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
						placeholder="Search a stop or route"
						required
						bind:value={searchInput}
					/>
				</div>
			</div>
		{/if}
	</div>
	<div>
		<ThemeSwitcher />
	</div>
</div>
