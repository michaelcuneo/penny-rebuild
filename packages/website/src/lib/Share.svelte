<script lang="ts">
  import { onMount } from "svelte";
  import ShareButton from "./ShareButton.svelte";

  export let quote;
  export let url;
  export let ariaLabel = 'Share on Facebook';
  let classes = '';

  let FB:any;
  onMount(() => {
    const windowRef:any = window // so that you don't get an 
    
    if(typeof windowRef.FB !== 'undefined'){
      FB = windowRef.FB;
    }

    FB.ui({
      method: 'share',
      href: 'https://developers.facebook.com/docs/',
    }, function(response:any){});
  });


  export { classes as class };

  let href;
  let share: string = 'facebook';
  
  $: href = encodeURI(`https://facebook.com/dialog/share?link=${url}&quote=${quote}`);
</script>

<style>
:global(.ssbc-button--facebook) {
  background-color: #3b5998;
}

:global(.ssbc-button--facebook:active),
:global(.ssbc-button--facebook:hover) {
  background-color: #2d4373;
}
</style>

{#if share="facebook"}
  <ShareButton class="ssbc-button--facebook {classes}" {...$$restProps} {ariaLabel} {href}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
    </svg>
  </ShareButton>
{/if}