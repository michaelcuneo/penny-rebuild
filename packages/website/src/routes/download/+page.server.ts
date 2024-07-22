import type { Actions, PageServerLoad } from './$types';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Bucket } from 'sst/node/bucket';

export const actions = {
  async get({ request }: { request: Request }) {
    // Extract the form data from the request
    const formData = await request.formData();

    // Get the details from the form data
    const code = formData.get('code')?.toString();

    // Command to get the GIF from the S3 bucket
    const command = new GetObjectCommand({
      Bucket: Bucket.public.bucketName,
      Key: code + '.gif',
    })

    // Get the GIF from the S3 bucket
    const url = await getSignedUrl(new S3Client({}), command);

    // Check if the GIF exists
    const check = await fetch(url);

    if (!check.ok) {
      return { success: false, error: "This code does not exist!" };
    } else {
      return { success: true, url: url };
    }
  }
} satisfies Actions;
