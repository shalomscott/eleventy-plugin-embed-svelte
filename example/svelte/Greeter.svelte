<script>
	export let name;
	let count = 0;
</script>

<h1>Hello there {name}!</h1>

<h2>
	Here's the obligatory
	<strong>&ldquo;reactive&rdquo;</strong>
	counter:
	{count}
</h2>

<button on:click={() => ++count}>Up the count!</button>
