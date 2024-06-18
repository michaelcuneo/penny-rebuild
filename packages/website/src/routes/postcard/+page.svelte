<script lang="ts">
	import { fade } from 'svelte/transition';
	import Penny from '$lib/Penny.svg';
	import { postcards } from '$lib/Postcards';
	import Textfield from '@smui/textfield';
  import Button from '@smui/button';

  let postcardText = postcards[Math.floor(Math.random() * postcards.length)].postCard;

  const changePostcard = () => {
    postcardText = postcards[Math.floor(Math.random() * postcards.length)].postCard;
  };

  const sendPostcard = () => {
    alert(postcard);
  };

  let postcard = '';
</script>

<div class="postcard poetsen-one-regular" in:fade>
  <img class="postcard-image" src={Penny} alt="Penny Logo" />
  <div class="postcard-input">
    <div class="postcard-text">
      {postcardText}
    </div>
    <Textfield style="width: 100%; height: auto;" textarea variant="outlined" bind:value={postcard} />
    <div>
      <Button on:click={changePostcard}>New Postcard</Button>
      <Button variant="raised" on:click={sendPostcard}>Send Postcard</Button>
    </div>
  </div>
</div>

<style>
	.postcard {
		display: flex;
    position: relative;
		color: #f489a3;
		font-size: 1.6rem;
		height: calc(100vh - 222px);
		justify-content: center;
    align-items: center;
	}
  .postcard-image {
    position: absolute;
    width: 1000px;
  }
  .postcard-input {
    position: absolute;
    margin-left: -180px;
    width: 600px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
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
