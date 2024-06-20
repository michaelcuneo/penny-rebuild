import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';
import { groupBy } from '$lib/utils/helper';

// Send user to Auth if the user is not logged in.
export const load = (async ({ locals }) => {
  if (!locals.session) {
    throw redirect(303, '/auth/login');
  }

  // Send a GET request to the list upload endpoint.
  const listUploads = await fetch(`${API_URL}/upload/list`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const uploads = await listUploads.json();

  // Send a GET request to the list postcard endpoint.
  const listPostcards = await fetch(`${API_URL}/postcard/list`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const postcards = await listPostcards.json();

  const listSurveys = await fetch(`${API_URL}/question/list`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const surveys = await listSurveys.json();

  console.log(surveys);

  let groupedSurveys = groupBy(surveys, (survey: any) => survey.questionId);
  let groupedEntries = Array.from(groupedSurveys.values());

  let data = {
    uploads: uploads,
    postcards: postcards,
    surveys: groupedEntries,
  };

  return { data };
}) satisfies PageServerLoad;