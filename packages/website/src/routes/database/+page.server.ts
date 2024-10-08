import type { PageServerLoad } from './$types';
import { Bucket } from 'sst/node/bucket';

// Send user to Auth if the user is not logged in.
export const load = (async ({ locals }) => {
  const listSurveys = await fetch(`https://1cwj4ysj5h.execute-api.ap-southeast-2.amazonaws.com/question/list`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const surveys = await listSurveys.json();

  for (let i = 0; i < surveys.length; i++) {
    console.log(surveys);
    /*
    const createUploadResponse = await fetch(
      `https://1cwj4ysj5h.execute-api.ap-southeast-2.amazonaws.com/question/update?id=${surveys[i].id}&createdAt=${surveys[i].createdAt}&questionId=${surveys[i].questionId}&questionnaireId=${surveys[i].questionId}&response=${surveys[i].response}&updatedAt=${surveys[i].updatedAt}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    */
  }

  const data = {
    surveys: surveys,
    bucket: Bucket.public.bucketName
  };

  return { data };
}) satisfies PageServerLoad;
