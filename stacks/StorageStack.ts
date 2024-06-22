import { Bucket, StackContext } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
  const bucket = new Bucket(stack, "public", {
    cors: [
      {
        maxAge: "1 day",
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
      },
    ],
    blockPublicACLs: false,
  });

  bucket.cdk.bucket.grantPublicAccess();

  return { bucket };
}
