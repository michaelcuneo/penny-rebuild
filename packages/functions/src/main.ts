import { ApiHandler } from "sst/node/api";

// This is only here to test to make sure the API is listening at the endpoint.
export const handler = ApiHandler(async (_evt) => {
  return {
    statusCode: 200,
    body: `Hello world. The time is ${new Date().toISOString()}`,
  };
});
