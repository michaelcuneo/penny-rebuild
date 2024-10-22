<script lang="ts">
  import { onMount } from 'svelte';
  import Tab, { Label } from '@smui/tab';
  import Dialog, { Content, Actions } from '@smui/dialog';
  import Button, { Icon } from '@smui/button';
  import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
  import TabBar from '@smui/tab-bar';
  import { postcards } from '$lib/utils/Postcards.js';

  let form: HTMLFormElement;

  let dialogOpen = false;
  let contentType = '';
  let currentContent: ContentType | null;
  let currentPostcard: PostcardType | null;
  let currentSurvey: QuestionType | null;

  $: currentContent = null;
  $: currentPostcard = null;
  $: currentSurvey = null;

  const getPostcard = (id: string) => {
    const postcard = postcards.filter((postcard) => postcard.id === id);
    if (postcard[0]?.postCard) {
      return postcard[0].postCard;
    }
    
    return 'Postcard not found';
  }

  const openContentDialog = async (object: ContentType) => {
    // Open the dialog
    currentContent = object;
    contentType = 'Content';
    dialogOpen = true;
  }

  const openPostcardDialog = async (object: PostcardType) => {
    // Open the dialog
    currentPostcard = object;
    contentType = 'Postcard';
    dialogOpen = true;
  }

  const openSurveyDialog = async (object: QuestionType) => {
    // Open the dialog
    currentSurvey = object;
    contentType = 'Survey';
    dialogOpen = true;
  }

  let active = 'Content';
  export let data;
</script>

<div class="admin">
  <h1>Penny Administration</h1>
  <TabBar tabs={['Submissions', 'Postcards', 'Surveys']} let:tab bind:active>
    <!-- Note: the `tab` property is required! -->
    <Tab {tab}>
      <Label>{tab}</Label>
    </Tab>
  </TabBar>
  <div class="admin-content">
  {#if active === 'Submissions'}
    <DataTable table$aria-label="Submissions" style="max-width: 100%;">
      <Head>
        <Row>
          <Cell>Name</Cell>
          <Cell>Email</Cell>
          <Cell>Created</Cell>
          <Cell>Content Type</Cell>
          <Cell>Approved</Cell>
          <Cell>Likes</Cell>
          <Cell numeric>Content ID</Cell>
        </Row>
      </Head>
      <Body>
        {#if data.data.uploads.length > 0}
        {#each data.data.uploads as object}
          <Row on:click={() => openContentDialog(object)}>
            <Cell>{object.firstName} {object.lastName}</Cell>
            <Cell>{object.email}</Cell>
            <Cell>{object.createdAt}</Cell>
            <Cell>{object.uploadType}</Cell>
            <Cell>{object.approved}</Cell>
            <Cell>{object.likes}</Cell>
            <Cell numeric>{object.uploadId}</Cell>
          </Row>
        {/each}
        {/if}
      </Body>
    </DataTable>
  {:else if active === 'Postcards'}
    <DataTable table$aria-label="Postcard Responses" style="max-width: 100vw">
      <Head>
        <Row>
          <Cell>Postcard ID</Cell>
          <Cell>Question</Cell>
          <Cell>Response</Cell>
          <Cell>Created</Cell>
        </Row>
      </Head>
      <Body>
        {#if data.data.postcards.length > 0}
          {#each data.data.postcards as object}
            <Row on:click={() => openPostcardDialog(object)}>
              <Cell>{object.postcardId}</Cell>
              <Cell>{getPostcard(object.postcardId)}</Cell>
              <Cell>{object.response}</Cell>
              <Cell>{object.createdAt}</Cell>
            </Row>
          {/each}
        {/if}
      </Body>
    </DataTable>
  {:else if active === 'Surveys'}
    <DataTable table$aria-label="Survey Responses" style="max-width: 100%;">
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

{#if dialogOpen}
<Dialog
  bind:open={dialogOpen}
  aria-labelledby="dialog-title"
  aria-describedby="dialog-content"
>
  <Content id="dialog-content">
    {#if currentContent && contentType === 'Content'}
      <h4>Content Admin</h4>
      <p>{currentContent.firstName} {currentContent.lastName}</p>
      <p>{currentContent.email}</p>
      {#if currentContent.uploadType === 'video/mp4' || currentContent.uploadType === 'video/webm' || currentContent.uploadType === 'video/ogg' || currentContent.uploadType === 'video/quicktime'}
        <video src={currentContent.media} width="320" controls controlsList="nodownload" aria-placeholder="Video">
          <track kind="captions" />
        </video>
      {:else if currentContent.uploadType === 'image/png' || currentContent.uploadType === 'image/jpeg' || currentContent.uploadType === 'image/gif' || currentContent.uploadType === 'image/webp'}
        <img src={currentContent.media} alt={currentContent.uploadType} width="320" />
      {:else if currentContent.uploadType === 'audio/mpeg' || currentContent.uploadType === 'audio/ogg' || currentContent.uploadType === 'audio/wav' || currentContent.uploadType === 'audio/webm' || currentContent.uploadType === 'audio/flac' || currentContent.uploadType === 'audio/aac' || currentContent.uploadType === 'audio/x-m4r'}
        <audio src={currentContent.media} controls controlsList="nodownload" aria-placeholder="Audio">
          <track kind="captions" />
        </audio>
      {:else}
        <p>Content not able to be parsed, bad format</p>
      {/if}
    {/if}
    {#if currentPostcard && contentType === 'Postcard'}
      <h4>Postcard Admin</h4>
      <p>{getPostcard(currentPostcard.postcardId)}</p>
      <p>{currentPostcard.response}</p>
    {/if}
    {#if currentSurvey && contentType === 'Survey'}
      <h4>Survey Admin</h4>
      <p>{currentSurvey.id}</p>
      <p>Reading Surveys coming in a future update</p>
    {/if}
  </Content>
  <Actions>
    {#if currentContent && contentType === 'Content'}
      <Button action="submit">
        <Label>Deny</Label>
      </Button>
      <Button action="submit">
        <Label>Approve</Label>
      </Button>
    {/if}
    <Button action="submit">
      <Label>Close</Label>
    </Button>
  </Actions>
</Dialog>
{/if}

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