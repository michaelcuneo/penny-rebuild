<script lang="ts">
  export let quote;
  export let url;
  export let ariaLabel;
	
  const onClick = async () => {
    FB.ui({
      app_id: '1705537896897059',
      method: 'feed',
      link: url,
      source: 'http://penny.soci.org.au/',
      caption: 'Penny Penrith',
      message: 'Facebook Dialogs are easy!',
      quote: quote,
    }), (response: any) => {
      if (response && !response.error) {
        console.log('Post was published.');
      } else {
        console.log('Post was not published.');
      }
    };
  };
  </script>

<button class="ssbc-button--facebook ssbc-button__icon--fill ssbc-button__icon--outline" aria-label={ariaLabel} on:click={onClick}>
  <svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
  </svg>
</button>

<style>
  .ssbc-button--facebook {
    background-color: #3b5998;
    text-decoration: none;
    color: #fff;
    display: inline-block;
    transition: 25ms ease-out;
    padding: 0.75em;
  }

  .ssbc-button--facebook:active,
  .ssbc-button--facebook:hover {
    background-color: #2d4373;
  }
  
  .svg {
    width: 1em;
    height: 1em;
    margin: 0;
    vertical-align: middle;
  }
  
  .ssbc-button__icon--fill {
    fill: #fff;
    stroke: none;
  }
  
  .ssbc-button__icon--outline {
    fill: none;
    stroke: #fff;
  }
  </style>