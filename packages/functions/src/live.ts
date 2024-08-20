import { ApiHandler } from "sst/node/api";
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { Live } from "@penny-rebuild/core/live";

// Try to add the Question to the DynamoDB Database.
// Return 400 if it fails.
export const create: APIGatewayProxyHandlerV2 = async (event) => {
  const hengeId = event?.queryStringParameters?.hengeId as string;

  try {
    const statusCreated = await Live.create(hengeId);

    return {
      statusCode: 200,
      body: statusCreated ? JSON.stringify(statusCreated) : JSON.stringify("Status created"),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};

export const list = ApiHandler(async (_evt) => {
  const data = await Live.list();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
});