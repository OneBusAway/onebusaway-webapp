<script>
    import { PUBLIC_OBA_REGION_NAME } from '$env/static/public';
    import ThemeSwitcher from '$lib/ThemeSwitch/ThemeSwitcher.svelte';

    import '../../app.css';
</script>

<div class='flex justify-between items-center px-4 bg-blur-md bg-white/80 dark:bg-black dark:text-white border-b border-neutral-300'>
    <div class='py-2 px-2'>
        <h1 class='text-3xl font-semibold'>{PUBLIC_OBA_REGION_NAME}</h1>
    </div>
    <div>
        <ThemeSwitcher />
    </div>
</div>
