<script>
	export let name;
	let lastname = '';
</script>

<style>
	div {
		padding: 1em;
		margin-bottom: 1em;
		border: 1px solid black;
		width: fit-content;
		box-shadow: 0 8px 6px -6px black;
	}
</style>

<div>
	<h1>Nice to meet you {name} {lastname || "(what's your last name?)"}!</h1>
	<label for="lastname">My last name is:</label>
	<input id="lastname" type="text" bind:value={lastname} />
</div>
