import { ApiHandler } from "sst/node/api";
import { Contact } from "@penny-rebuild/core/contact";

// Try to add the Postcard to the DynamoDB Database.
// Return 400 if it fails.
export const create = ApiHandler(async (_evt) => {
  await Contact.create();

  return {
    statusCode: 200,
    body: "Contact created",
  };
});

export const list = ApiHandler(async (_evt) => {
  await Contact.list();

  return {
    statusCode: 200,
    body: "Contacts listed"
  };
});
