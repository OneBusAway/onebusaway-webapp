<script>
	import '../app.css';
	import Header from '../components/navigation/Header.svelte'
</script>

<div class='h-dvh w-full relative'>
	<div class='absolute top-0 left-0 right-0 z-40'>
		<Header />
	</div>
	<div>
		<slot></slot>
	</div>
</div>

<style></style>