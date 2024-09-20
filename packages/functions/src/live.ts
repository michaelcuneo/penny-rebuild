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

export const list: APIGatewayProxyHandlerV2 = async (event) => {
  const limit = event?.queryStringParameters?.limit as string;
  // Send a GET request to the list upload endpoint.

  console.log("Listing all statuses");
  const data = await Live.list(limit);

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
