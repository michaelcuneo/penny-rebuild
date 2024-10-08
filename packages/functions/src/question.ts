import { ApiHandler } from "sst/node/api";
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { Question } from "@penny-rebuild/core/question";

// Try to add the Question to the DynamoDB Database.
// Return 400 if it fails.
export const create: APIGatewayProxyHandlerV2 = async (event) => {
  const q1 = event?.queryStringParameters?.q1 as string;
  const q2 = event?.queryStringParameters?.q2 as string;
  const q3 = event?.queryStringParameters?.q3 as string;
  const q4 = event?.queryStringParameters?.q4 as string;
  const q5 = event?.queryStringParameters?.q5 as string;
  const q6 = event?.queryStringParameters?.q6 as string;
  const q7 = event?.queryStringParameters?.q7 as string;
  const q8 = event?.queryStringParameters?.q8 as string;
  const q9 = event?.queryStringParameters?.q9 as string;
  const q10 = event?.queryStringParameters?.q10 as string;
  const q11 = event?.queryStringParameters?.q11 as string;

  await Question.create(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11);

  return {
    statusCode: 200,
    body: "Questionaire created",
  };
};

export const update: APIGatewayProxyHandlerV2 = async (event) => {
  const id = event?.queryStringParameters?.id as string;
  const questionId = event?.queryStringParameters?.questionId as string;
  const questionnaireId = event?.queryStringParameters?.questionnaireId as string;
  const createdAt = event?.queryStringParameters?.createdAt as string;
  const updatedAt = event?.queryStringParameters?.updatedAt as string;
  const response = event?.queryStringParameters?.response as string;


  await Question.update(id, questionId, createdAt, questionnaireId, updatedAt, response);

  return {
    statusCode: 200,
    body: "Questionaire updated",
  };
}

export const list = ApiHandler(async (_evt) => {
  const data = await Question.list();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
});
