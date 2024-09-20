import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { ApiHandler } from "sst/node/api";
import { Postcard } from "@penny-rebuild/core/postcard";

// Try to add the Postcard to the DynamoDB Database.
// Return 400 if it fails.
export const create: APIGatewayProxyHandlerV2 = async (event) => {
  const postcardId = event?.queryStringParameters?.postcardId as string;
  const response = event?.queryStringParameters?.response as string;

  await Postcard.create(postcardId, response);

  return {
    statusCode: 200,
    body: "Upload created",
  };
};

export const list = ApiHandler(async (_evt) => {
  const data = await Postcard.list();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
});
