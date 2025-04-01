import type { Actions } from './$types';
import { Api } from 'sst/node/api';

export const actions = {
	async save({ request }: { request: Request }) {
		const url = Api.api.url;
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
		const q12 = formData.get('q12')?.toString();

		// Send a POST request to the create upload endpoint
		const createUploadResponse = await fetch(
			`${url}/question/create?q1=${q1}&q2=${q2}&q3=${q3}&q4=${q4}&q5=${q5}&q6=${q6}&q7=${q7}&q8=${q8}&q9=${q9}&q10=${q10}&q11=${q11}&q12=${q12}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			}
		);

		// If the request was not successful, return an error response
		if (!createUploadResponse.ok) {
			return { success: false, error: 'Failed to create upload.' };
		}

		// Return a success response
		return { success: true, error: null };
	}
} satisfies Actions;
