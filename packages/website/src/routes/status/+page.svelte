<script lang="ts">
	import Graph from './Graph.svelte';
  import Tab, { Label } from '@smui/tab';
  import TabBar from '@smui/tab-bar';
	import type { PageData } from '../$types';

  let active: string = 'Henge 1';

  export let data: PageData;
</script>

<main class="container">
  <TabBar tabs={['Henge 1', 'Henge 2', 'Henge 3', 'Henge 4']} let:tab bind:active>
    <!-- Note: the `tab` property is required! -->
    <Tab {tab}>
      <Label>{tab}</Label>
    </Tab>
  </TabBar>
  {#if active === "Henge 1"}
    <Graph data={data.data.status[0]}/>
  {/if}
  {#if active === "Henge 2"}
    <Graph data={data.data.status[1]}/>
  {/if}
  {#if active === "Henge 3"}
    <Graph data={data.data.status[2]}/>
  {/if}
  {#if active === "Henge 4"}
    <Graph data={data.data.status[3]}/>
  {/if}
</main>

<style>
  .container {
    display: flex;
    width: 100%;
    margin: 0 auto;
    flex-direction: column;
  }
</style>