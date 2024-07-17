import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { Bucket } from 'sst/node/bucket';
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

  const groupedSurveys = groupBy(surveys, (survey: { questionId: string }) => survey.questionId);
  const groupedEntries = Array.from(groupedSurveys.values());

  const data = {
    uploads: uploads,
    postcards: postcards,
    surveys: groupedEntries,
    bucket: Bucket.public.bucketName
  };

  return { data };
}) satisfies PageServerLoad;

export const actions = {
  /**
   * Asynchronously handles the 'magicLinks' action.
   * 
   * @param {Object} param - An object containing the request.
   * @param {Request} param.request - The request object.
   * @returns {Promise<Object>} - An object with success and error properties.
  */
  async save({ request }: { request: Request }) {
    // Extract the form data from the request
    const formData = await request.formData();

    // Get the details from the form data
    const uploadId = formData.get('uploadId')?.toString();
    const approved = formData.get('approved')?.toString();

    // Send a POST request to the create upload endpoint
    const createUploadResponse = await fetch(`${API_URL}/upload/update?id=${uploadId}&approved=${approved}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    // If the request was not successful, return an error response
    if (!createUploadResponse.ok) {
      return { success: false, error: 'Failed to update upload.' };
    }

    // Return a success response
    return { success: true, error: null };
  }
} satisfies Actions;
