import { StackContext, Table } from "sst/constructs";

export function TableStack({ stack }: StackContext) {
  // Define users table
  const usersTable = new Table(stack, "Users", {
    fields: {
      id: "string",
      createdAt: "string",
      updatedAt: "string",
      email: "string",
    },
    primaryIndex: { partitionKey: "email" },
  });

  const postCardsTable = new Table(stack, "PostCards", {
    fields: {
      id: "string",
      createdAt: "string",
      updatedAt: "string",
      postcard: "string",
    },
    primaryIndex: { partitionKey: "id" },
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

  const questionsTable = new Table(stack, "Questions", {
    fields: {
      id: "string",
      createdAt: "string",
      updatedAt: "string",
      question: "string",
      options: "string",
    },
    primaryIndex: { partitionKey: "id" },
  });

  const questionTable = new Table(stack, "Question", {
    fields: {
      id: "string",
      createdAt: "string",
      updatedAt: "string",
      questionnaireId: "string",
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
    },
    primaryIndex: { partitionKey: "id" },
  });

  const statusTable = new Table(stack, "Status", {
    fields: {
      id: "string",
      hengeId: "string",
      createdAt: "string",
      updatedAt: "string",
      voltage: "string",
      cloud: "string",
      updated: "string",
      condition: "string",
      uv: "string",
      temperature: "string",
    },
    primaryIndex: { partitionKey: "id", sortKey: "hengeId" },
  });

  return {
    usersTable,
    postcardTable,
    questionTable,
    uploadsTable,
    statusTable,
  };
}
