<script>
	import '../app.css';
	import Header from '../components/navigation/Header.svelte';
	import { config } from '@fortawesome/fontawesome-svg-core';
	import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the CSS
	config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above
</script>

<div class="relative h-dvh w-full">
	<div class="absolute left-0 right-0 top-0 z-40">
		<Header />
	</div>
	<div>
		<slot></slot>
	</div>
</div>
