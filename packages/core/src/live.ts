export * as Live from "./live";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Table } from 'sst/node/table';
import crypto from 'crypto';
import { debug } from "console";

const client = new DynamoDBClient();
const documentClient = DynamoDBDocumentClient.from(client);

// Add the Question to the DynamoDB Database.
export async function create(hengeId: string) {
  let uuid = crypto.randomUUID();
  let data: any = {};

  const params = {
    TableName: Table.Status.tableName,
    Item: {
      id: uuid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      hengeId: hengeId,
      status: "active"
    }
  };

  data = await documentClient.send(new PutCommand(params));

  if (data.$metadata.httpStatusCode === 200) {
    const params = {
      TableName: Table.Status.tableName,
      Key: {
        hengeId: hengeId,
      }
    }

    await documentClient.send(new GetCommand(params));
  }

  return data && data.Item ? data.Item : JSON.stringify(undefined);
}

export async function list() {
  console.error("Listing all statuses");
  const command = new ScanCommand({
    TableName: Table.Status.tableName
  });

  const data = await documentClient.send(command);

  return data && data.Items ? data.Items : JSON.stringify(undefined);
}
