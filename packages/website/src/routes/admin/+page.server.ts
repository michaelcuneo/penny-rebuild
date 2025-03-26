import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { Bucket } from 'sst/node/bucket';
import { Api } from 'sst/node/api';
import { groupBy } from '$lib/utils/helper';

// Send user to Auth if the user is not logged in.
export const load = (async ({ locals }) => {
	/*
  if (!locals.session) {
    throw redirect(303, '/auth/login');
  }
  */

	const API_URL = Api.api.url;

	// Send a GET request to the list upload endpoint.
	const listUploads = await fetch(`${API_URL}/upload/list`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' }
	});

	const uploads = await listUploads.json();

	// Get the presigned URL for each upload
	for (const upload of uploads) {
		// Fetch the user using the email
		const mediaResponse = await fetch(`${API_URL}/presignedurl/${upload.uploadId}`);
		const media = await mediaResponse.json();
		upload.media = media.url;
	}

	// Send a GET request to the list postcard endpoint.
	const listPostcards = await fetch(`${API_URL}/postcard/list`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' }
	});

	const postcards = await listPostcards.json();

	const listSurveys = await fetch(`${API_URL}/question/list`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' }
	});

	const surveys = await listSurveys.json();

	const groupedSurveys = groupBy(
		surveys,
		(survey: { questionnaireId: string }) => survey.questionnaireId
	);
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
		const API_URL = 'https://1cwj4ysj5h.execute-api.ap-southeast-2.amazonaws.com/';

		// Extract the form data from the request
		const formData = await request.formData();

		// Get the details from the form data
		const uploadId = formData.get('uploadId')?.toString();
		const approved = formData.get('approved')?.toString();

		// Send a POST request to the create upload endpoint
		const createUploadResponse = await fetch(
			`${API_URL}/upload/update?id=${uploadId}&approved=${approved}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			}
		);

		// If the request was not successful, return an error response
		if (!createUploadResponse.ok) {
			return { success: false, error: 'Failed to update upload.' };
		}

		// Return a success response
		return { success: true, error: null };
	}
} satisfies Actions;
