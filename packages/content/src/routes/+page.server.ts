import type { PageServerLoad } from './$types';
import { groupBy } from '$lib/utils/helper';

export const load = (async () => {
  // Send a GET request to the list upload endpoint.
  const listUploads = await fetch(`https://1cwj4ysj5h.execute-api.ap-southeast-2.amazonaws.com/upload/list`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const uploads = await listUploads.json();

  // Group uploads by email
  const groupedUploads = groupBy(uploads, (upload: { uploadType: string }) => upload.uploadType);
  const groupedEntries = Array.from(groupedUploads.values());

  const data = {
    uploads: groupedEntries,
    bucket: 'production-penny-rebuild-stor-publicbucket5c3dbab0-mmgromfvkfep',
  };

  return { data };
}) satisfies PageServerLoad;

export const actions = {
  async save({ request }: { request: Request }) {
    // Extract the form data from the request
    const formData = await request.formData();

    // Get the details from the form data
    const id = formData.get('currentUpload')?.toString();
    const likes = formData.get('currentUploadLikes')?.toString();

    // Send a POST request to the create upload endpoint
    const createUpdateResponse = await fetch(`https://1cwj4ysj5h.execute-api.ap-southeast-2.amazonaws.com/upload/update?id=${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    // If the request was not successful, return an error response
    if (!createUpdateResponse.ok) {
      return { success: false, error: 'Failed to create upload.' };
    }

    // Return a success response
    return { success: true, error: null };
  },
  async report({ request }: { request: Request }) {
    const formData = await request.formData();
    const hengeId = formData.get('hengeId')?.toString();

    const createReportResponse = await fetch(
      `https://1cwj4ysj5h.execute-api.ap-southeast-2.amazonaws.com/live/create?hengeId=${hengeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    console.log(createReportResponse);

    if (!createReportResponse.ok) {
      return { success: false, error: 'Failed to create report.' };
    }

    return { success: true, error: null };
  }
}