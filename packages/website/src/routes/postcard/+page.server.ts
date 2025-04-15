import type { Actions } from './$types';
import { Api } from 'sst/node/api';

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
    const postcardId = formData.get('postcard')?.toString();
    const response = formData.get('response')?.toString();

    // Send a POST request to the create upload endpoint
    const createPostcardResponse = await fetch(`${Api.api.url}/postcard/create?postcardId=${postcardId}&response=${response}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    // If the request was not successful, return an error response
    if (!createPostcardResponse.ok) {
      return { success: false, error: 'Failed to create upload.' };
    }

    // Return a success response
    return { success: true, error: null };
  }
} satisfies Actions;
