<script>
	import foot from '$lib/logos_penrith.jpg';
</script>

<footer>
	<img src={foot} alt="Penrith Logos"/>
	<ul>
		<li><a href="https://fastlab.soci.org.au">&copy; FASTlab, 2024</a></li> |
		<li><a href="/privacy">Privacy</a></li> |
		<li><a href="/terms">Terms</a></li> | 
		<li><a href="/admin">Admin</a></li>
	</ul>
</footer>

<style>
	footer {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
    margin-top: auto;
		font-size: 0.8rem;
		background-color: #313639;
		color: white;
		width: 100%;
	}
	a {
		text-decoration: none;
		color: white;
		font-weight: 600;
		font-style: italic;
	}
	ul {
		display: inline-flex;
	}
	li {
		margin: 0rem 1rem 0rem 1rem;
		list-style-type: none;
	}
	img {
		width: 100%;
	}
	@media screen and (max-width: 1200px) {
		footer {
			display: none;
		}
	}
</style>
