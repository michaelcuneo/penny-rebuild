<script lang="ts">
  import Tab, { Label } from '@smui/tab';
  import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
  import TabBar from '@smui/tab-bar';

  import { postcards } from '$lib/utils/Postcards.js';

  const getPostcard = (id: string) => {
    const postcard = postcards.filter((postcard) => postcard.id === id);
    if (postcard[0]?.postCard) {
      return postcard[0].postCard;
    }
    
    return 'Postcard not found';
  }

  let active = 'Content';

  $: console.log(data.data.surveys);
  export let data;
</script>

<div class="admin">
  <h1>Penny Administration</h1>
  <TabBar tabs={['Content', 'Postcards', 'Surveys']} let:tab bind:active>
    <!-- Note: the `tab` property is required! -->
    <Tab {tab}>
      <Label>{tab}</Label>
    </Tab>
  </TabBar>
  <div class="admin-content">
  {#if active === 'Content'}
    <DataTable table$aria-label="People list" style="max-width: 100%;">
      <Head>
        <Row>
          <Cell>Name</Cell>
          <Cell>Email</Cell>
          <Cell numeric>Content ID</Cell>
          <Cell>Content Type</Cell>
          <Cell>Approved</Cell>
          <Cell>Likes</Cell>
        </Row>
      </Head>
      <Body>
        {#if data.data.uploads.length > 0}
        {#each data.data.uploads as object}
          <Row>
            <Cell>{object.firstName} {object.lastName}</Cell>
            <Cell>{object.email}</Cell>
            <Cell numeric>{object.uploadId}</Cell>
            <Cell>{object.uploadType}</Cell>
            <Cell>{object.approved}</Cell>
            <Cell>{object.likes}</Cell>
          </Row>
        {/each}
        {/if}
      </Body>
    </DataTable>
  {:else if active === 'Postcards'}
    <DataTable table$aria-label="People list" style="max-width: 100%;">
      <Head>
        <Row>
          <Cell>Question</Cell>
          <Cell>Response</Cell>
        </Row>
      </Head>
      <Body>
        {#if data.data.postcards.length > 0}
          {#each data.data.postcards as object}
            <Row>
              <Cell>{getPostcard(object.postcardId)}</Cell>
              <Cell>{object.response}</Cell>
            </Row>
          {/each}
        {/if}
      </Body>
    </DataTable>
  {:else if active === 'Surveys'}
    <DataTable table$aria-label="People list" style="max-width: 100%;">
      <Head>
        <Row>
          <Cell>Survey ID</Cell>
        </Row>
      </Head>
      <Body>
        {#if data.data.surveys.length > 0}
          {#each data.data.surveys as object, i}
            <Row>
              <Cell>{object[i].id}</Cell>
            </Row>
          {/each}
        {/if}
      </Body>
    </DataTable>
  {/if}
  </div>
</div>

<style>
  .admin {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
  }
  .admin-content {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
</style>