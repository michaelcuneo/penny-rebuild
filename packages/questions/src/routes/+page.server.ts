import type { Actions } from './$types';

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
    const q1 = formData.get('q1')?.toString();
    const q2 = formData.get('q2')?.toString();
    const q3 = formData.get('q3')?.toString();
    const q4 = formData.get('q4')?.toString();
    const q5 = formData.get('q5')?.toString();
    const q6 = formData.get('q6')?.toString();
    const q7 = formData.get('q7')?.toString();
    const q8 = formData.get('q8')?.toString();
    const q9 = formData.get('q9')?.toString();
    const q10 = formData.get('q10')?.toString();
    const q11 = formData.get('q11')?.toString();

    // Send a POST request to the create upload endpoint
    const createUploadResponse = await fetch(
      `https://1cwj4ysj5h.execute-api.ap-southeast-2.amazonaws.com/question/create?q1=${q1}&q2=${q2}&q3=${q3}&q4=${q4}&q5=${q5}&q6=${q6}&q7=${q7}&q8=${q8}&q9=${q9}&q10=${q10}&q11=${q11}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    // If the request was not successful, return an error response
    if (!createUploadResponse.ok) {
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
} satisfies Actions;
