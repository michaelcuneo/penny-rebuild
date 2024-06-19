export * as Upload from "./upload";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Table } from 'sst/node/table';

type Content = {
  id: "string",
  firstName: "string",
  lastName: "string",
  email: "string",
  uploadId: "string",
  uploadType: "string",
  approved: "binary",
  likes: "number",
};

const client = new DynamoDBClient();
const documentClient = DynamoDBDocumentClient.from(client);

// Add the Upload to the DynamoDB Database.
export async function create(firstName: string, lastName: string, email: string, uploadId: string, uploadType: string) {
  const id = crypto.randomUUID();

  const params = {
    TableName: Table.Uploads.tableName,
    Item: {
      id: id,
      firstName: firstName,
      lastName: lastName,
      email: email,
      uploadId: uploadId,
      uploadType: uploadType,
      approved: false,
      likes: 0
    }
  };

  const data = await documentClient.send(new PutCommand(params));

  if (data.$metadata.httpStatusCode === 200) {
    const params = {
      TableName: Table.Uploads.tableName,
      Key: {
        id: id,
      }
    }

    const content = await documentClient.send(new GetCommand(params));

    return content && content.Item ? content.Item : JSON.stringify(undefined);
  }
}

export async function update() {
  const id = crypto.randomUUID();
  // write to database
  return id;
}

export async function list() {
  const id = crypto.randomUUID();
  // write to database
  return id;
}