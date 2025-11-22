<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app">
	<header>
		<h1>⭐ SvelteKit Sample</h1>
		<nav>
			<a href="/">Home</a>
			<a href="/about">About</a>
		</nav>
	</header>
	<main>
		{@render children?.()}
	</main>
	<footer>© {new Date().getFullYear()} Sample</footer>
</div>

<style>
	.app {
		max-width: 840px;
		margin: 2rem auto;
		padding: 0 1rem;
		font-family: system-ui, sans-serif;
	}
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}
	nav a {
		margin-right: 1rem;
		text-decoration: none;
		color: #0b5bd3;
	}
	nav a:hover {
		text-decoration: underline;
	}
	main {
		margin-top: 1.5rem;
	}
	footer {
		margin-top: 3rem;
		color: #666;
		font-size: 0.9rem;
	}
</style>
