import { ApiHandler } from "sst/node/api";
import { Question } from "@penny-rebuild/core/questionbackup";

export const list = ApiHandler(async (_evt) => {
  const data = await Question.list();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
});
