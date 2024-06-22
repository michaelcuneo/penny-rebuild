import type { PageServerLoad } from './$types';
import { Bucket } from 'sst/node/bucket';
import { API_URL } from '$env/static/private';
import { groupBy } from '$lib/utils/helper';

export const load = (async ({ locals }) => {
  // Send a GET request to the list upload endpoint.
  const listUploads = await fetch(`${API_URL}/upload/list`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const uploads = await listUploads.json();

  // Group uploads by email
  let groupedUploads = groupBy(uploads, (upload: any) => upload.uploadType);
  let groupedEntries = Array.from(groupedUploads.values());

  let data = {
    uploads: groupedEntries,
    bucket: Bucket.public.bucketName
  };

  return { data };
}) satisfies PageServerLoad;
