export * as Postcard from "./postcard";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Table } from 'sst/node/table';
import crypto from 'crypto';

const client = new DynamoDBClient();
const documentClient = DynamoDBDocumentClient.from(client);

// Add the Upload to the DynamoDB Database.
export async function create(postcardId: string, response: string) {
  const id = crypto.randomUUID();

  const params = {
    TableName: Table.Postcard.tableName,
    Item: {
      id: id,
      postcardId: postcardId,
      response: response,
    }
  };

  const data = await documentClient.send(new PutCommand(params));

  if (data.$metadata.httpStatusCode === 200) {
    const params = {
      TableName: Table.Postcard.tableName,
      Key: {
        id: id,
      }
    }

    const content = await documentClient.send(new GetCommand(params));

    return content && content.Item ? content.Item : JSON.stringify(undefined);
  }
}

export async function list() {
  const command = new ScanCommand({
    TableName: Table.Postcard.tableName
  });

  const data = await documentClient.send(command);

  return data && data.Items ? data.Items : JSON.stringify(undefined);
}