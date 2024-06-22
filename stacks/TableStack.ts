import { StackContext, Table } from "sst/constructs";

export function TableStack({ stack }: StackContext) {
  // Define users table
  const usersTable = new Table(stack, 'Users', {
    fields: { id: 'string', email: 'string' },
    primaryIndex: { partitionKey: 'email' }
  });

  const postcardTable = new Table(stack, "Postcard", {
    fields: {
      id: "string",
      postcardId: "string",
      response: "string",
    },
    primaryIndex: { partitionKey: "id" },
  });

  const questionTable = new Table(stack, "Question", {
    fields: {
      id: "string",
      questionId: "string",
      response: "string",
    },
    primaryIndex: { partitionKey: "id" },
  });

  const uploadsTable = new Table(stack, "Uploads", {
    fields: {
      id: "string",
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
