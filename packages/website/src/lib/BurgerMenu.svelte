<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import Hoverable from './Hoverable.svelte';

	let menuVisible = false;

	function handleClick() {
		menuVisible = !menuVisible;
		let el: HTMLElement | null = document.getElementById('svelte');
		el?.classList.toggle('fixed-position', menuVisible);
	}
</script>

{#if menuVisible}
	<menu-overlay
		role="button"
		tabindex="0"
		transition:fade={{ duration: 500 }}
		on:click={handleClick}
		on:keydown={handleClick}
	/>
{/if}

{#if menuVisible}
	<main-menu transition:fly={{ x: 200, duration: 500 }}>
		<close-button role="button" tabindex="0" on:click={handleClick} on:keydown={handleClick}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="36.77"
				height="36.77"
				viewBox="0 0 36.77 36.77"
			>
				<g id="icon-close" transform="translate(-1466 -148)">
					<rect
						id="Rectangle_14"
						data-name="Rectangle 14"
						width="4"
						height="48"
						transform="translate(1466 150.828) rotate(-45)"
						fill="#fff"
					/>
					<rect
						id="Rectangle_15"
						data-name="Rectangle 15"
						width="4"
						height="48"
						transform="translate(1499.941 148) rotate(45)"
						fill="#fff"
					/>
				</g>
			</svg>
		</close-button>
		<hr />
		<menu-links>
			<a data-sveltekit-preload-data href="/" on:click={handleClick}>
				<Hoverable let:hovering={active}>
					<animated-link class:active>
						{#if active}
							<item>
								Home
								<sub>Back to the start.</sub>
							</item>
							<greaterthan>&gt;</greaterthan>
						{:else}
							<item> Home </item>
						{/if}
					</animated-link>
				</Hoverable>
			</a>
			<a data-sveltekit-preload-data href="/about" on:click={handleClick}>
				<Hoverable let:hovering={active}>
					<animated-link class:active>
						{#if active}
							<item>
								About
								<sub>What we do</sub>
							</item>
							<greaterthan>&gt;</greaterthan>
						{:else}
							<item> About </item>
						{/if}
					</animated-link>
				</Hoverable>
			</a>
			<a data-sveltekit-preload-data href="/statement" on:click={handleClick}>
				<Hoverable let:hovering={active}>
					<animated-link class:active>
						{#if active}
							<item>
								Research Statement
								<sub>Research Statement for Penny</sub>
							</item>
							<greaterthan>&gt;</greaterthan>
						{:else}
							<item> Research Statement </item>
						{/if}
					</animated-link>
				</Hoverable>
			</a>
			<a data-sveltekit-preload-data href="/upload" on:click={handleClick}>
				<Hoverable let:hovering={active}>
					<animated-link class:active>
						{#if active}
							<item>
								Upload Content
								<sub>Upload content to Penny</sub>
							</item>
							<greaterthan>&gt;</greaterthan>
						{:else}
							<item> Upload Content </item>
						{/if}
					</animated-link>
				</Hoverable>
			</a>
			<a data-sveltekit-preload-data href="/postcard" on:click={handleClick}>
				<Hoverable let:hovering={active}>
					<animated-link class:active>
						{#if active}
							<item
								>Send Postcard
								<sub>Send a postcard to Penny.</sub>
							</item>
							<greaterthan>&gt;</greaterthan>
						{:else}
							<item> Send Postcard </item>
						{/if}
					</animated-link>
				</Hoverable>
			</a>
			<a data-sveltekit-preload-data href="/dashboard" on:click={handleClick}>
				<Hoverable let:hovering={active}>
					<animated-link class:active>
						{#if active}
							<item>
								Data Dashboard
								<sub>Look at the dashboard.</sub>
							</item>
							<greaterthan>&gt;</greaterthan>
						{:else}
							<item> Data Dashboard </item>
						{/if}
					</animated-link>
				</Hoverable>
			</a>
			<a data-sveltekit-preload-data href="/contact" on:click={handleClick}>
				<Hoverable let:hovering={active}>
					<animated-link class:active>
						{#if active}
							<item>
								Contact
								<sub>Contact FASTlab.</sub>
							</item>
							<greaterthan>&gt;</greaterthan>
						{:else}
							<item> Contact </item>
						{/if}
					</animated-link>
				</Hoverable>
			</a>
		</menu-links>
	</main-menu>
{/if}

<menu-button role="button" tabindex="0" on:click={handleClick} on:keydown={handleClick}>
<svg id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56">
  <defs>
    <style>
      .cls-1 {
        fill: #f389a3;
        stroke-width: 0px;
      }
    </style>
  </defs>
  <path class="cls-1" d="M38.34,40.14h-7.59v-7.59c0-.08-.02-.16-.03-.23,7.68-1.3,13.54-8,13.54-16.04,0-8.97-7.3-16.28-16.28-16.28S11.72,7.3,11.72,16.28c0,8.04,5.87,14.74,13.54,16.04,0,.08-.02.15-.02.23v7.59h-7.59c-1.52,0-2.76,1.24-2.76,2.76s1.23,2.76,2.76,2.76h7.59v7.59c0,1.52,1.24,2.76,2.76,2.76s2.76-1.24,2.76-2.76v-7.59h7.59c1.52,0,2.76-1.24,2.76-2.76s-1.23-2.76-2.76-2.76ZM17.24,16.28c0-5.93,4.83-10.76,10.76-10.76s10.76,4.83,10.76,10.76-4.83,10.76-10.76,10.76c-5.93,0-10.76-4.83-10.76-10.76Z"/>
</svg></menu-button
>

<style>
	menu-overlay {
		position: fixed;
		right: 0;
		height: 100vh;
		width: 100vw;
		background: rgba(0, 0, 0, 0.8);
		z-index: 9999;
	}
	main-menu {
		position: fixed;
		height: 100vh;
		right: 0;
		width: 560px;
		background: #313639;
		color: white;
		z-index: 9999;
		overflow: scroll;
	}
	menu-button {
		display: none;
		position: fixed;
		top: 26px;
		right: 26px;
		width: 56px;
		height: 56px;
		z-index: 2;
	}
	close-button {
		display: block;
		position: absolute;
		top: 35px;
		left: 35px;
	}
	hr {
		width: 100%;
		display: block;
		position: absolute;
		margin: 0;
		padding: 0;
		border: 0;
		border-top: 1px solid white;
		top: 109px;
	}
	menu-links {
		display: flex;
		min-width: 100%;
		flex-direction: column;
		position: absolute;
		top: 109px;
	}
	animated-link {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-begin;
		padding: 0px 35px;
	}
	sub {
		font-family: 'Merriweather' sans-serif;
		font-size: calc(15px + (18 - 15) * ((100vw - 320px) / (1920 - 320)));
		line-height: calc(22px + (22 - 22) * ((100vw - 320px) / (1920 - 320)));
		padding-bottom: 35px;
	}
	item {
		display: flex;
		flex-direction: column;
		font-family: 'Barlow Condensed', sans-serif;
		font-size: calc(30px + (50 - 30) * ((100vw - 320px) / (1920 - 320)));
		line-height: calc(100px + (100 - 100) * ((100vw - 320px) / (1920 - 320)));
	}
	.active {
		transition: all 0.2s ease-in-out;
		background-color: #4e843b;
		align-items: center;
		color: white;
	}
	a {
		text-decoration: none;
		color: white;
	}

	/* Mobiles and Tablets ----------- */
	@media only screen and (max-width: 1224px) {
		main-menu {
			width: 100%;
		}
		menu-links {
			padding-bottom: 144px;
		}
		menu-button {
			display: block;
			position: fixed;
			top: 20px;
			right: 20px;
			width: 40px;
			height: 40px;
			z-index: 4;
		}
		animated-link {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: flex-begin;
			padding: 0px 20px;
		}
	}
</style>
