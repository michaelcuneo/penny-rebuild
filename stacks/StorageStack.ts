import { Bucket, StackContext } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
  const bucket = new Bucket(stack, "public", {
    cors: [
      {
        maxAge: "60 days",
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
      },
    ],
    blockPublicACLs: false,
  });

  bucket.cdk.bucket.grantPublicAccess();

  stack.addOutputs({
    bucketName: bucket.bucketName,
  });

  return { bucket };
}
