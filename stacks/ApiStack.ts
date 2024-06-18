import { StackContext, Api, use } from "sst/constructs";
import { TableStack } from "./TableStack";

export function ApiStack({ stack }: StackContext) {
  const { usersTable, contentTable, questionTable, postcardTable, contactTable } = use(TableStack);

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
          contentTable,
          questionTable,
          postcardTable,
          contactTable,
        ]
      }
    },
    routes: {
      "GET /api": "packages/functions/src/main.handler",
      "POST /api/user/create": "packages/functions/src/user.handler",
      "GET /api/user/getUserByEmail/{email}": "packages/functions/src/userByEmail.handler",
      "POST /api/question/create": "packages/functions/src/question.create",
      "GET /api/question/list": "packages/functions/src/question.list",
      "POST /api/postcard/create": "packages/functions/src/postcard.create",
      "GET /api/postcard/list": "packages/functions/src/postcard.list",
      "POST /api/upload/create": "packages/functions/src/upload.create",
      "GET /api/upload/list": "packages/functions/src/upload.list",
      "PUT /api/upload/update": "packages/functions/src/upload.update",
      "POST /api/contact/create": "packages/functions/src/contact.create",
      "GET /api/contact/list": "packages/functions/src/contact.list",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return { api };
}
