<script>
	import {
		PUBLIC_OBA_REGION_NAME,
		PUBLIC_OBA_LOGO_URL,
		PUBLIC_NAV_BAR_LINKS
	} from '$env/static/public';

	import ThemeSwitcher from '$lib/ThemeSwitch/ThemeSwitcher.svelte';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';

	const dispatch = createEventDispatcher();

	let searchInput = '';
	let isMobileMenuOpen = false;

	async function handleSearch() {
		try {
			const response = await fetch(`/api/oba/search?query=${encodeURIComponent(searchInput)}`);
			const results = await response.json();
			dispatch('searchResults', results);
		} catch (error) {
			console.error('Error fetching search results:', error);
		}
	}

	const onHandleSearch = (event) => {
		if (event.key === 'Enter') {
			handleSearch();
		}
	};

	let headerLinks = null;

	if (PUBLIC_NAV_BAR_LINKS) {
		headerLinks = JSON.parse(PUBLIC_NAV_BAR_LINKS);
	}

	function toggleNavbar() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
</script>

<div
	class="bg-blur-md bg-white/80 dark:bg-black dark:text-white md:flex-row md:px-8 flex items-center justify-between px-4 border-b border-gray-500"
>
	<div class="md:flex-none flex items-center justify-between flex-1">
		<div class="md:w-auto flex justify-between w-full gap-4 px-2 py-2">
			<div>
				<a href="/">
					<img src={PUBLIC_OBA_LOGO_URL} alt={PUBLIC_OBA_REGION_NAME} class="h-10 rounded-sm" />
				</a>
			</div>

			<div class="md:hidden flex items-center justify-end">
				<button on:click={toggleNavbar}>
					<svg
						class="burger-icon dark:text-white w-6 h-6 text-gray-900"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16m-7 6h7"
						></path>
					</svg>
				</button>
			</div>
		</div>

		<div class="md:flex items-center hidden gap-4 px-2 py-2">
			{#if PUBLIC_OBA_SEARCH_ENABLED === 'true'}
				<div class="max-w-md mx-auto">
					<label
						for="default-search"
						class="dark:text-white mb-2 text-sm font-medium text-gray-900 sr-only">Search</label
					>
					<div class="relative">
						<div class="start-0 ps-3 absolute inset-y-0 flex items-center pointer-events-none">
							<svg
								class="dark:text-gray-400 w-4 h-4 text-gray-500"
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
							class="bg-gray-50 ps-10 dark:border-gray-600 dark:placeholder-gray-400 block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-full"
							placeholder="Search a stop or route"
							required
							bind:value={searchInput}
							on:keydown={onHandleSearch}
						/>
					</div>
				</div>
			{/if}

			<div class="gap-x-4 flex">
				{#each Object.entries(headerLinks) as [key, value]}
					<div class="bg-white/80 dark:bg-gray-800 border rounded-md">
						<a href={value} class="dark:text-white block px-2 py-1 font-semibold text-gray-900"
							>{key}</a
						>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<div class="md:flex hidden">
		<ThemeSwitcher />
	</div>
</div>

{#if isMobileMenuOpen}
	<div
		class="dark:bg-black md:hidden fixed inset-0 z-50 flex flex-col items-center justify-center p-4 space-y-6 bg-white"
		transition:fly={{ x: 1000, duration: 300 }}
	>
		<button on:click={toggleNavbar}>
			<svg
				class="close-icon dark:text-white w-6 h-6 text-gray-900"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				></path>
			</svg>
		</button>

		<div class="flex flex-col items-center gap-4">
			{#each Object.entries(headerLinks) as [key, value]}
				<a
					href={value}
					class="dark:text-white block text-xl font-semibold text-gray-900"
					on:click={toggleNavbar}>{key}</a
				>
			{/each}
		</div>
		<div>
			<ThemeSwitcher />
		</div>
	</div>
{/if}

<style>
	.burger-icon,
	.close-icon {
		cursor: pointer;
	}
</style>
