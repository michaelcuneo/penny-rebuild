import { ApiHandler } from "sst/node/api";
import { Postcard } from "@penny-rebuild/core/postcard";

// Try to add the Postcard to the DynamoDB Database.
// Return 400 if it fails.
export const create = ApiHandler(async (_evt) => {
  await Postcard.create();

  return {
    statusCode: 200,
    body: "Postcard created",
  };
});

export const list = ApiHandler(async (_evt) => {
  await Postcard.list();

  return {
    statusCode: 200,
    body: "Postcards listed",
  };
})