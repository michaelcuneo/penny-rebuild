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

  const contentTable = new Table(stack, "Content", {
    fields: {
      id: "string",
      firstName: "string",
      lastName: "string",
      email: "string",
      uploadId: "string",
      approved: "binary",
      likes: "number",
    },
    primaryIndex: { partitionKey: "id" },
  })

  const contactTable = new Table(stack, "Contact", {
    fields: {
      id: "string",
      contactId: "string",
      responded: "binary",
    },
    primaryIndex: { partitionKey: "id" },
  })

  return { usersTable, postcardTable, questionTable, contentTable, contactTable };
};
