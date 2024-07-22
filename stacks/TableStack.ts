import { StackContext, Table } from "sst/constructs";

export function TableStack({ stack }: StackContext) {
  // Define users table
  const usersTable = new Table(stack, 'Users', {
    fields: {
      id: "string",
      createdAt: "string",
      updatedAt: "string",
      email: "string"
    },
    primaryIndex: { partitionKey: 'email' }
  });

  const postcardTable = new Table(stack, "Postcard", {
    fields: {
      id: "string",
      createdAt: "string",
      updatedAt: "string",
      postcardId: "string",
      response: "string",
    },
    primaryIndex: { partitionKey: "id" },
  });

  const questionTable = new Table(stack, "Question", {
    fields: {
      id: "string",
      createdAt: "string",
      updatedAt: "string",
      questionId: "string",
      response: "string",
    },
    primaryIndex: { partitionKey: "id" },
  });

  const uploadsTable = new Table(stack, "Uploads", {
    fields: {
      id: "string",
      createdAt: "string",
      updatedAt: "string",
      firstName: "string",
      lastName: "string",
      email: "string",
      uploadId: "string",
      uploadType: "string",
      approved: "binary",
      likes: "number",
    },
    primaryIndex: { partitionKey: "id" },
  })

  return { usersTable, postcardTable, questionTable, uploadsTable };
};
