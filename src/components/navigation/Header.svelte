<script>
	import {
		PUBLIC_OBA_REGION_NAME,
		PUBLIC_OBA_LOGO_URL,
		PUBLIC_NAV_BAR_LINKS
	} from '$env/static/public';

	import ThemeSwitcher from '$lib/ThemeSwitch/ThemeSwitcher.svelte';
	import { t } from 'svelte-i18n';
	import '$lib/i18n';
	let headerLinks = null;

	if (PUBLIC_NAV_BAR_LINKS) {
		headerLinks = JSON.parse(PUBLIC_NAV_BAR_LINKS);
	}

	const translationKeys = {
		Home: 'home',
		About: 'about',
		Contact: 'contact',
		'Fares & Tolls': 'fares_and_tolls'
	};
</script>

<div
	class="bg-blur-md flex items-center justify-between border-b border-gray-500 bg-white/80 px-4 dark:bg-black dark:text-white"
>
	<div class="flex items-center justify-center gap-4 px-2 py-2">
		<div class="flex items-center justify-center gap-x-2">
			<a href="/" class="block">
				<img src={PUBLIC_OBA_LOGO_URL} alt={PUBLIC_OBA_REGION_NAME} class="h-10 rounded-sm" />
			</a>
			<a href="/" class="block text-xl font-extrabold">
				{PUBLIC_OBA_REGION_NAME}
			</a>
		</div>

		<div class="flex gap-x-4">
			{#each Object.entries(headerLinks) as [key, value]}
				<div class="rounded-md border bg-white/80 dark:bg-gray-800">
					<a href={value} class="block px-2 py-1 font-semibold text-gray-900 dark:text-white">
						{$t(`header.${translationKeys[key]}`)}
					</a>
				</div>
			{/each}
		</div>
	</div>
	<div>
		<ThemeSwitcher />
	</div>
</div>
