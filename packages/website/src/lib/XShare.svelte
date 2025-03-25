<script lang="ts">
  export let text;
  export let url;
  export let hashtags;
  export let via;
  export let related;
  export let ariaLabel;
	
  let href;

  $: href = encodeURI(`https://x.com/intent/tweet/?text=${text}&hashtags=${hashtags}&via=${via}&related=${related}&url=${url}`);
</script>

<a class="ssbc-button--x ssbc-button__icon--fill ssbc-button__icon--outline" aria-label={ariaLabel} {href}>
  <svg class="svg" width="25" height="23" viewBox="0 0 25 23" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M19.38 0.622803H23.06L14.98 9.79481L24.42 22.2368H17.012L11.212 14.6759L4.57199 22.2368H0.891987L9.45199 12.4268L0.411987 0.622803H8.00399L13.244 7.52972L19.38 0.622803ZM18.092 20.0834H20.132L6.93199 2.69647H4.73999L18.092 20.0834Z"
			fill="white"
		/>
	</svg>
</a>

<style>
  .ssbc-button--x {
    background-color: #14171a;
    text-decoration: none;
    color: #fff;
    display: inline-block;
    transition: 25ms ease-out;
    padding: 0.75em;
  }

  .ssbc-button--x:active,
  .ssbc-button--x:hover {
    background-color: #000000;
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