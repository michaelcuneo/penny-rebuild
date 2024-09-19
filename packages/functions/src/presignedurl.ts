import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const uploadId = event?.pathParameters?.uploadId || "" as string;

  const command = new GetObjectCommand({
    Key: uploadId,
    Bucket: "production-penny-rebuild-stor-publicbucket5c3dbab0-mmgromfvkfep",
  });
  const url = await getSignedUrl(new S3Client({}), command);

  return {
    statusCode: 200,
    body: JSON.stringify({ url }),
  };
}
