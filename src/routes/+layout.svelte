<script>
	import Header from '$components/navigation/Header.svelte';
	import '../app.css';
	import { config } from '@fortawesome/fontawesome-svg-core';
	import '@fortawesome/fontawesome-svg-core/styles.css';
	import '$lib/i18n';
	config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above
</script>

<div class="relative h-dvh w-full">
	<div class="fixed w-full">
		<Header />
	</div>
	<div class="h-[100vh] overflow-hidden">
		<slot></slot>
	</div>
</div>
