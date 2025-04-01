<script lang="ts">
  import { run } from 'svelte/legacy';

	import Graph from './Graph.svelte';
  import Tab, { Label } from '@smui/tab';
  import TabBar from '@smui/tab-bar';
	import type { PageData } from '../$types';
	import { onMount } from 'svelte';

  let active: string = $state('Henge 1');

  onMount(() => {
    data = {
      data: {
        status: [
          {
            name: 'Henge 1',
            value: 1,
          },
          {
            name: 'Henge 2',
            value: 2,
          },
          {
            name: 'Henge 3',
            value: 3,
          },
          {
            name: 'Henge 4',
            value: 4,
          },
        ],
      },
      authenticated: false,
    };
  });

  let period: string;
  let periodOptions: string[] = ['1h', '1d', '1w', '1m', '1y'];

  let periodChange = (event: Event) => {
    period = (event.target as HTMLSelectElement).value;
  };

  let periodSubmit = () => {
    console.log(period);
  };
  

  interface Props {
    data: PageData;
  }

  let { data = $bindable() }: Props = $props();
  run(() => {
    console.log(data);
  });
</script>

<main class="container">
  <TabBar tabs={['Henge 1', 'Henge 2', 'Henge 3', 'Henge 4']}  bind:active>
    {#snippet children({ tab })}
        <!-- Note: the `tab` property is required! -->
      <Tab {tab}>
        <Label>{tab}</Label>
      </Tab>
          {/snippet}
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