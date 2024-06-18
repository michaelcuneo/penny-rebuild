import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Send user to Auth if the user is not logged in.
export const load = (async ({ locals }) => {
  if (!locals.session) {
    throw redirect(303, '/auth/login');
  }
}) satisfies PageServerLoad;