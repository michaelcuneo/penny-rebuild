export * as Question from "./question";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Table } from 'sst/node/table';
import crypto from 'crypto';

const client = new DynamoDBClient();
const documentClient = DynamoDBDocumentClient.from(client);

// Add the Question to the DynamoDB Database.
export async function create(q1: string, q2: string, q3: string, q4: string, q5: string, q6: string, q7: string, q8: string, q9: string, q10: string, q11: string, q12: string) {
  let data: any = {};

  const answers = [q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12];
  const questionSetID = crypto.randomUUID();

  for (let i = 0; i < answers.length; i++) {
    let uuid = crypto.randomUUID();

    const params = {
      TableName: Table.Question.tableName,
      Item: {
        id: uuid,
        questionnaireId: questionSetID,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        questionId: i + 1,
        response: answers[i]
      }
    };

    data = await documentClient.send(new PutCommand(params));

    if (data.$metadata.httpStatusCode === 200) {
      const params = {
        TableName: Table.Question.tableName,
        Key: {
          id: uuid,
        }
      }

      await documentClient.send(new GetCommand(params));
    }

    setTimeout(() => { }, 1000); // So we don't spam DynamoDB
  }
  return data && data.Item ? data.Item : JSON.stringify(undefined);
};

export async function update(id: string, questionId: string, createdAt: string, questionnaireId: string, updatedAt: string, response: string) {
  const params = {
    TableName: Table.Question.tableName,
    Item: {
      id: id,
      questionnaireId: questionnaireId,
      createdAt: createdAt,
      updatedAt: updatedAt,
      questionId: questionId,
      response: response
    }
  };

  await documentClient.send(new PutCommand(params));
};

export async function list() {
  const command = new ScanCommand({
    TableName: Table.Question.tableName
  });

  const data = await documentClient.send(command);

  return data && data.Items ? data.Items : JSON.stringify(undefined);
};
