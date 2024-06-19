import { StackContext, Api, use } from "sst/constructs";
import { TableStack } from "./TableStack";

export function ApiStack({ stack }: StackContext) {
  const { usersTable, uploadsTable, questionTable, postcardTable, contactTable } = use(TableStack);

  const api = new Api(stack, "api", {
    cors: {
      allowCredentials: true,
      allowHeaders: ['content-type'],
      allowMethods: ['ANY'],
      allowOrigins: [`http://localhost:3000`, `https://penny.soci.org.au`]
    },
    defaults: {
      function: {
        bind: [
          usersTable,
          uploadsTable,
          questionTable,
          postcardTable,
          contactTable,
        ]
      }
    },
    routes: {
      "GET /": "packages/functions/src/main.handler",
      "POST /user/create": "packages/functions/src/userCreate.handler",
      "GET /user/getUserByEmail/{email}": "packages/functions/src/userByEmail.handler",
      "POST /question/create": "packages/functions/src/question.create",
      "GET /question/list": "packages/functions/src/question.list",
      "POST /postcard/create": "packages/functions/src/postcard.create",
      "GET /postcard/list": "packages/functions/src/postcard.list",
      "POST /upload/create": "packages/functions/src/upload.create",
      "GET /upload/list": "packages/functions/src/upload.list",
      "PUT /upload/update": "packages/functions/src/upload.update",
      "POST /contact/create": "packages/functions/src/contact.create",
      "GET /contact/list": "packages/functions/src/contact.list",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return { api };
}
