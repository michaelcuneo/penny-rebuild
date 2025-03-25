import type { PageServerLoad } from './$types';
// import { API_URL } from '$env/static/private';
// import { groupBy } from '$lib/utils/helper';

// Send user to Auth if the user is not logged in.
export const load = (async () => {
  // Send a GET request to the list upload endpoint.

  /*const listStatus = await fetch(`${API_URL}/live/list?limit=4`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const statuses = await listStatus.json();

  const groupedStatuses = groupBy(statuses, (status: { hengeId: string }) => status.hengeId);
  const groupedEntries = Array.from(groupedStatuses.values());

  groupedEntries.sort((a, b) => {
    return a.createdAt < b.createdAt ? 1 : -1;
  });

  const data = {
    status: groupedEntries,
  };

  return { data };
  */
}) satisfies PageServerLoad;
