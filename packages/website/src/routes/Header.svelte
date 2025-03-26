<script>
	import penny from '$lib/PennyLogo.svg';
</script>

<header>
	<a href="/">LOGO</a>
	<ul>
		<li><a href="/">Home</a></li>
		<li><a href="/about">About</a></li>
		<li><a href="/upload">Upload Content</a></li>
		<li><a href="/postcard">Send Postcard</a></li>
		<!--<li><a href="/status">Henge Status</a></li>-->
		<li><a href="https://data.penny.soci.org.au">Data Dashboard</a></li>
		<li><a href="/contact">Contact</a></li>
	</ul>
</header>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 109px;
		background-color: #313639;
		color: white;
		padding: 0 1rem;
	}
	/*
	img {
		position: absolute;
		left: 26px;
		top: 26px;
		height: 56px;
	}
	*/
	ul {
		display: flex;
		flex-direction: row;
		align-items: center;
		list-style: none;
		margin: 0;
		padding: 0;
		flex: 1;
		justify-content: flex-end;
	}
	li {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin: 0 10px;
	}
	a {
		font-size: 1.6rem;
		text-decoration: none;
		font-family: 'Barlow Condensed', sans-serif;
		font-weight: 600;
		font-style: italic;
		-webkit-text-stroke: #313639 1px;
    -webkit-text-fill-color: #e8cc6c;
	}
	/* Mobiles and Tablets ----------- */
	@media only screen and (max-width: 1224px) {
		header {
			justify-content: flex-start;
			height: 80px;
		}
		/*
		img {
			left: 20px;
			top: 20px;
			height: 40px;
		}
		*/
		ul {
			display: none;
		}
	}
</style>
