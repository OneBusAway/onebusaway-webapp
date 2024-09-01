<script>
	import '../app.css';
	import { config } from '@fortawesome/fontawesome-svg-core';
	import '@fortawesome/fontawesome-svg-core/styles.css';
	config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above
</script>

<div class="relative h-dvh w-full">
	<div>
		<slot></slot>
	</div>
</div>
