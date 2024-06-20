import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { ApiHandler } from 'sst/node/api';
import { Upload } from "@penny-rebuild/core/upload";

// Try to add the Postcard to the DynamoDB Database.
// Return 400 if it fails.
export const create: APIGatewayProxyHandlerV2 = async (event) => {
  const firstName = event?.queryStringParameters?.firstName as string;
  const lastName = event?.queryStringParameters?.lastName as string;
  const email = event?.queryStringParameters?.email as string;
  const uploadId = event?.queryStringParameters?.uploadId as string;
  const uploadType = event?.queryStringParameters?.uploadType as string;

  await Upload.create(firstName, lastName, email, uploadId, uploadType);

  return {
    statusCode: 200,
    body: "Upload created",
  };
};

export const handler = ApiHandler(async (_evt) => {
  await Upload.update();

  return {
    statusCode: 200,
    body: "Upload updated",
  };
});

export const list = ApiHandler(async (_evt) => {
  const data = await Upload.list();

  console.log(JSON.stringify(data));

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
});
