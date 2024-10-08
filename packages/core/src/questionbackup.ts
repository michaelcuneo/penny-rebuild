export * as Question from "./questionbackup";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient();
const documentClient = DynamoDBDocumentClient.from(client);

export async function list() {
  const command = new ScanCommand({
    TableName: "production-penny-rebuild-questions_recovery",
  });

  const data = await documentClient.send(command);

  return data && data.Items ? data.Items : JSON.stringify(undefined);
};
