<script>
	import { PUBLIC_OBA_REGION_NAME, PUBLIC_OBA_LOGO_URL } from '$env/static/public';
	import ThemeSwitcher from '$lib/ThemeSwitch/ThemeSwitcher.svelte';
</script>

<div
	class="bg-blur-md flex items-center justify-between border-b border-neutral-300 bg-white/80 px-4 dark:bg-black dark:text-white"
>
	<div class="px-2 py-2">
		<a href="/">
			<img src={PUBLIC_OBA_LOGO_URL} alt={PUBLIC_OBA_REGION_NAME} class="h-10 rounded-sm" />
		</a>
	</div>
	<div>
		<ThemeSwitcher />
	</div>
</div>
