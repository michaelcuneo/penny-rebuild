<script lang="ts">
  import { run } from 'svelte/legacy';

  import { browser } from '$app/environment';
  import { Chart, registerables } from 'chart.js';
  import { onMount } from 'svelte';
  import LayoutGrid, { Cell } from '@smui/layout-grid';
	import type { PageData } from '../$types';
  import Paper from '@smui/paper';

  Chart.register(...registerables);

  let onlineLineChartElement: HTMLCanvasElement = $state();
  let temperatureLineChartElement: HTMLCanvasElement = $state();
  let cloudLineChartElement: HTMLCanvasElement = $state();
  let voltageLineChartElement: HTMLCanvasElement = $state();
  let uvLineChartElement: HTMLCanvasElement = $state();

  onMount(() => {
    const onlineData = {
      labels: data.map(({ updated }) => updated.slice(-5)),
      datasets: [
        {
          label: 'Online Status',
          data: data.map(({ status }) => status === "true"),
          borderRadius: 4,
          borderWidth: 2,
        },
      ],
    };

    if (browser) {
      new Chart(onlineLineChartElement, {
        type: 'line',
        data: onlineData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              max: 1,
              ticks: {
                stepSize: 1,
              }
            },
          },
        },
      });
    }

    const temperatureData = {
      labels: data.map(({ updated }) => updated.slice(-5)),
      datasets: [
        {
          label: 'Temperature @ 2 Meters',
          data: data.map(({ temperature }) => temperature),
          borderRadius: 4,
          borderWidth: 2,
        },
      ],
    };

    if (browser) {
      new Chart(temperatureLineChartElement, {
        type: 'line',
        data: temperatureData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });
    }

    const cloudData = {
      labels: data.map(({ updated }) => updated.slice(-5)),
      datasets: [
        {
          label: 'Cloud Cover',
          data: data.map(({ cloud }) => cloud),
          borderRadius: 4,
          borderWidth: 2,
        },
      ],
    };

    if (browser) {
      new Chart(cloudLineChartElement, {
        type: 'line',
        data: cloudData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });
    }

    const voltageData = {
      labels: data.map(({ updated }) => updated.slice(-5)),
      datasets: [
        {
          label: 'Voltage',
          data: data.map(({ voltage }) => voltage),
          borderRadius: 4,
          borderWidth: 2,
        },
      ],
    };

    if (browser) {
      new Chart(voltageLineChartElement, {
        type: 'line',
        data: voltageData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });
    }

    const uvData = {
      labels: data.map(({ updated }) => updated.slice(-5)),
      datasets: [
        {
          label: 'UV Index',
          data: data.map(({ uv }) => uv),
          borderRadius: 4,
          borderWidth: 2,
        },
      ],
    };

    if (browser) {
      new Chart(uvLineChartElement, {
        type: 'line',
        data: uvData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });
    }
  });


  interface Props {
    data: PageData['data']['status'];
  }

  let { data }: Props = $props();
  run(() => {
    data.sort((a, b) => {
      return b.createdAt < a.createdAt ? 1 : -1;
    });
  });
</script>

<main class="main-container">
  <div class="graph-content">
    <LayoutGrid>
      <Cell>
        <Paper>
          <section>
            <canvas bind:this={onlineLineChartElement}></canvas>
          </section>
        </Paper>
      </Cell>
      <Cell>
        <Paper>
          <section>
            <canvas bind:this={temperatureLineChartElement}></canvas>
          </section>
        </Paper>
      </Cell>
      <Cell>
        <Paper>
          <section>
            <canvas bind:this={cloudLineChartElement}></canvas>
          </section>
        </Paper>
      </Cell>
      <Cell>
        <Paper>
          <section>
            <canvas bind:this={voltageLineChartElement}></canvas>
          </section>
        </Paper>
      </Cell>
      <Cell>
        <Paper>
          <section>
            <canvas bind:this={uvLineChartElement}></canvas>
          </section>
        </Paper>
      </Cell>
    </LayoutGrid>
  </div>
</main>

<style>
  .main-container {
    display: flex;
    width: 100%;
    margin: 0 auto;
    flex-direction: column;
  }
</style>