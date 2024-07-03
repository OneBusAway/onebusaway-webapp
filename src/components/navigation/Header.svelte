<script>
	import { PUBLIC_OBA_REGION_NAME } from '$env/static/public';
	import ThemeSwitcher from '$lib/ThemeSwitch/ThemeSwitcher.svelte';
</script>

<div
	class="bg-blur-md flex items-center justify-between border-b border-neutral-300 bg-white/80 px-4 dark:bg-black dark:text-white"
>
	<div class="px-2 py-2">
		<h1 class="text-3xl font-semibold">{PUBLIC_OBA_REGION_NAME}</h1>
	</div>
	<div>
		<ThemeSwitcher />
	</div>
</div>
