export * as Live from "./live";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Table } from 'sst/node/table';
import crypto from 'crypto';

const client = new DynamoDBClient();
const documentClient = DynamoDBDocumentClient.from(client);

// Add the Question to the DynamoDB Database.
export async function create(hengeId: string) {
  let uuid = crypto.randomUUID();
  let data: any = {};

  const params = {
    TableName: Table.Live.tableName,
    Item: {
      id: uuid,
      hengeId: hengeId,
      status: "active"
    }
  };

  data = await documentClient.send(new PutCommand(params));

  if (data.$metadata.httpStatusCode === 200) {
    const params = {
      TableName: Table.Live.tableName,
      Key: {
        hengeId: hengeId,
      }
    }

    await documentClient.send(new GetCommand(params));
  }

  return data && data.Item ? data.Item : JSON.stringify(undefined);
}

export async function list() {
  const command = new ScanCommand({
    TableName: Table.Question.tableName
  });

  const data = await documentClient.send(command);

  return data && data.Items ? data.Items : JSON.stringify(undefined);
}