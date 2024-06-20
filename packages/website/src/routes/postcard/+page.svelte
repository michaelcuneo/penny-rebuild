<script lang="ts">
  import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import Penny from '$lib/Penny.svg';
	import { postcards } from '$lib/utils/Postcards';
	import Textfield from '@smui/textfield';
  import Button from '@smui/button';
  import invite from '$lib/Invite_graphic.svg';	

  let postcard = postcards[Math.floor(Math.random() * postcards.length)];

  const changePostcard = () => {
    postcard = postcards[Math.floor(Math.random() * postcards.length)];
  };

  let response = '';
</script>

<div class="postcard poetsen-one-regular" in:fade>
  <img class="invite-image" src={invite} alt="Penny Logo" />
  <div class="postcard-area">
    <img class="postcard-image" src={Penny} alt="Penny Logo" />
    <div class="postcard-input">
      <form action="?/save" method="POST" use:enhance>
        <div class="postcard-text">
          {postcard.postCard}
        </div>
        <Textfield input$name="response" style="width: 100%; height: 360px;" textarea variant="filled" bind:value={response} />
        <input type="hidden" name="postcard" bind:value={postcard.id} />
        <div>
          <Button on:click={changePostcard}>New Postcard</Button>
          <Button variant="raised">Send Postcard</Button>
        </div>
      </form>
    </div>
  </div>
</div>

<style>
	.postcard {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
    width: 100vw;
    height: calc(100vh - 222px);
		justify-content: center;
		align-items: flex-start;
	}
  .postcard-area {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    align-items: flex-end;
  }
  .postcard-text {
    width: 30vw;
    font-size: 1.6rem;
    line-height: 1.2;
  }
  .postcard-input {
    display: flex;
    flex-direction: column;
    position: absolute;
    margin-right: 16vw;
    width: 30vw;
  }
  .postcard-image {
    display: flex;
    flex-direction: column;
    position: absolute;
    margin-right: 40px;
    width: 50vw;
  }
  .invite-image {
    position: absolute;
    bottom: 50px;
    left: 150px;
		height: 80vh;
	}
  @media screen and (max-width: 1224px) {
    .postcard-image {
      width: 800px;
    }
    .postcard-input {
      margin-left: -100px;
    }
  }
  @media screen and (max-width: 768px) {
    .postcard-image {
      width: 600px;
    }
    .postcard-input {
      margin-left: -50px;
    }
  }
  @media screen and (max-width: 480px) {
    .postcard-image {
      width: 400px;
    }
    .postcard-input {
      margin-left: 0;
      width: 300px;
    }
  }
</style>
