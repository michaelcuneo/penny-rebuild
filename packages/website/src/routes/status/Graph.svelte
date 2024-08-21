<script lang="ts">
  import { browser } from '$app/environment';
  import { Chart, registerables } from 'chart.js';
  import { onMount } from 'svelte';
	import type { PageData } from '../$types';

  Chart.register(...registerables);

  let onlineLineChartElement: HTMLCanvasElement;
  let temperatureLineChartElement: HTMLCanvasElement;
  let cloudLineChartElement: HTMLCanvasElement;
  let voltageLineChartElement: HTMLCanvasElement;
  let uvLineChartElement: HTMLCanvasElement;

  onMount(() => {
    const onlineData = {
      labels: data.map(({ updated }) => updated),
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
      labels: data.map(({ updated }) => updated),
      datasets: [
        {
          label: 'Temperature',
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
      labels: data.map(({ updated }) => updated),
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
      labels: data.map(({ updated }) => updated),
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
      labels: data.map(({ updated }) => updated),
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

  $: data.sort((a, b) => {
    return b.createdAt < a.createdAt ? 1 : -1;
  });

  export let data: PageData['data']['status'];
</script>

<main class="main-container">
  <div class="graph-content">
    <h1>Online Status</h1>
    <section>
      <canvas bind:this={onlineLineChartElement} />
    </section>
    <h1>Temperature</h1>
    <section>
      <canvas bind:this={temperatureLineChartElement} />
    </section>
    <h1>Cloud</h1>
    <section>
      <canvas bind:this={cloudLineChartElement} />
    </section>
    <h1>Voltage</h1>
    <section>
      <canvas bind:this={voltageLineChartElement} />
    </section>
    <h1>UV Index</h1>
    <section>
      <canvas bind:this={uvLineChartElement} />
    </section>
  </div>
</main>

<style>
  .main-container {
    display: flex;
    width: 100%;
    margin: 0 auto;
    flex-direction: column;
  }
  h1 {
    margin: 1rem 2rem;
  }
</style>