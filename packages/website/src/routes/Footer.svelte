<script>
	// import { Icon, Label } from '@smui/common';
	// import Fab from '@smui/fab';
	import foot from '$lib/logos_penrith.jpg';
</script>

<footer>
	<div class="container">
		<img src={foot} alt="Penrith Logos" />
		<!--
		<ul>
			<li><Fab extended color="primary"><Label>Henge 1 Questionnaire</Label><Icon class="material-icons">check_circle</Icon></Fab></li>
			<li><Fab extended color="primary"><Label>Henge 2 Flipdots</Label><Icon class="material-icons">check_circle</Icon></Fab></li>
			<li><Fab extended color="primary"><Label>Henge 3 Postcards</Label><Icon class="material-icons">check_circle</Icon></Fab></li>
			<li><Fab extended color="primary"><Label>Henge 4 Content</Label><Icon class="material-icons">check_circle</Icon></Fab></li>
		</ul>
		-->
	</div>
	<ul>
		<li><a href="https://www.newcastle.edu.au">&copy; The University of Newcastle, 2025</a></li>
		|
		<!--<li><a href="/privacy">Privacy</a></li> |
		<li><a href="/terms">Terms</a></li> | -->
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
		display: flex;
		flex-direction: row;
		align-items: center;
		list-style: none;
		margin: 2rem 0 2rem 0;
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
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 100%;
		background: white;
	}
	img {
		width: 60vw;
	}
	@media screen and (max-width: 1200px) {
		footer {
			display: none;
		}
	}
</style>
