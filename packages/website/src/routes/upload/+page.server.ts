import type { Actions, PageServerLoad } from './$types';
import { API_URL } from '$env/static/private';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Bucket } from 'sst/node/bucket';
import { v4 as uuidv4 } from 'uuid';

const id = uuidv4();

export const load: PageServerLoad = async ({ params }) => {
  const command = new PutObjectCommand({
    ACL: "public-read",
    Key: id,
    Bucket: Bucket.public.bucketName,
  })

  const url = await getSignedUrl(new S3Client({}), command);

  return { url, id };
}

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
    const firstName = formData.get('firstName')?.toString();
    const lastName = formData.get('lastName')?.toString();
    const email = formData.get('email')?.toString();
    const fileType = formData.get('fileType')?.toString();

    // Send a POST request to the create upload endpoint
    const createUploadResponse = await fetch(`${API_URL}/upload/create?email=${email}&firstName=${firstName}&lastName=${lastName}&uploadId=${id}&uploadType=${fileType}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    // If the request was not successful, return an error response
    if (!createUploadResponse.ok) {
      return { success: false, error: 'Failed to create upload.' };
    }

    // Return a success response
    return { success: true, error: null };
  }
} satisfies Actions;
