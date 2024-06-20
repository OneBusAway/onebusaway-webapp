<script>
	import '../app.css';
	import Header from '../components/navigation/Header.svelte'
</script>

<div class='h-dvh w-full'>
	<Header />
	<div>
		<slot></slot>
	</div>
</div>

<style></style>