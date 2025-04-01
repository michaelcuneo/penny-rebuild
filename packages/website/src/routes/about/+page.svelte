<script>
  import { fade } from 'svelte/transition';
</script>

<div class="page" in:fade>
  <div class="wrapper">
    <h1>Welcome to Nellies.</h1>
    <p>
      Nellies aims to capture and display content and data to better understand perceptions of safety in Penrith.
    </p>
    <p>
      Nellies has been designed by a team of clever and passionate academics, social workers, industrial designers, data specialists, planners and artists as part of the NSW government Safer Spaces for Women and Girls, Smart City Innovation Challenge.
    </p>
    <p>
      Women, girls and gender diverse communities have the right to feel safe, free and autonomous in our cities, however sadly this is not currently the reality for most.
    </p>
    <p>
      Research suggests that cities have historically been planned and designed for men and by men. They tend to reflect traditional gender roles and gendered division of labour. As a result generally our cities are not designed for or with women, girls and gender diverse communities. It is not surprising then that nearly 2 out of 3 women and girls do not feel safe in our public spaces.
    </p>
    <p>
      Through this small project we hope to better inform planners and decision makers how they may improve safety outcomes for women, girls and gender diverse communities in this public space. We also hope to provide a platform for sharing content and contribute to creating safer public spaces.
    </p>
    <h1>
      What is this study about?
    </h1>
    <p>
      The aim of the research is to capture data, content, narratives and stories related to perceptions of safety in public spaces.
    </p>
    <h1>
      Do I have to identify as female or LGBTI to get involved <span data-icon="?"></span>
    </h1>
    <p>
      No we want to hear from anyone who wishes to participate.
    </p>
    <h1>
      Is there any risk to me by being involved ?
    </h1>
    <p>
      Because we are talking about safety in public spaces, it may remind you of times when you felt unsafe. If you find any of the activities upsetting you do not have to participate, and shall you need support please contact Lifeline on 13 11 14. Your privacy is respected and you will remain anonymous by participating.
    </p>
    <h1>
      What is done with the data collected?
    </h1>
    <p>
      All data collected is anonymous unless you wish to contribute your personal information. The data collected will be shared with the University of Newcastle, NSW government and Penrith City Council.
    </p>
    <h1>
      Who is conducting this research?
    </h1>
    <p>
      The research is being conducted by the School of Humanities, Creative Industries and Social Sciences at the University of Newcastle.
    </p>
    <h1>
      How do I contact someone about this project?
    </h1>
    <p>
      Please use the contact form here. <a href="/contact">Contact</a>
    </p>
  </div>
</div>

<style>
  .page {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.wrapper {
		display: flex;
		flex-direction: column;
		justify-content: center;
		max-width: 1000px;
		padding: 1rem 1rem;
	}
  span {
		content: attr(data-icon);
		font-size: 1.25rem;
		margin-left: 0.5rem;
	}
</style>