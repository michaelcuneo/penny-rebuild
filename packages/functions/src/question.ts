import { ApiHandler } from "sst/node/api";
import { Question } from "@penny-rebuild/core/question";

// Try to add the Question to the DynamoDB Database.
// Return 400 if it fails.
export const create = ApiHandler(async (_evt) => {
  await Question.create();

  return {
    statusCode: 200,
    body: "Questionaire created",
  };
});

export const list = ApiHandler(async (_evt) => {
  return {
    statusCode: 200,
    body: "Questionaires listed",
  };
})
