import type { PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';

// Send user to Auth if the user is not logged in.
export const load = (async ({ locals }) => {
  // Send a GET request to the list upload endpoint.
  const listStatus = await fetch(`${API_URL}/status/list`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const status = await listStatus.json();

  const data = {
    status: status,
  };

  return { data };
}) satisfies PageServerLoad;