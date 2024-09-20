import { StackContext, Api, use } from "sst/constructs";
import { TableStack } from "./TableStack";
import { ConfigStack } from "./ConfigStack";

export function ApiStack({ stack }: StackContext) {
  const { emailService, emailHost, emailPort, emailUser, emailAppPass } = use(ConfigStack);
  const { usersTable, uploadsTable, questionTable, postcardTable, statusTable } = use(TableStack);

  const api = new Api(stack, "api", {
    cors: {
      allowCredentials: true,
      allowHeaders: ['content-type'],
      allowMethods: ['ANY'],
      allowOrigins: [`http://localhost:3000`, `https://penny.soci.org.au`, 'http://localhost:3001', 'http://localhost:4172'],
    },
    defaults: {
      function: {
        bind: [
          usersTable,
          uploadsTable,
          questionTable,
          postcardTable,
          statusTable,
          emailService,
          emailHost,
          emailPort,
          emailUser,
          emailAppPass
        ]
      }
    },
    routes: {
      "GET /": "packages/functions/src/main.handler",
      "GET /presignedurl/{uploadId}": "packages/functions/src/presignedurl.handler",
      "POST /user/create": "packages/functions/src/userCreate.handler",
      "GET /user/getUserByEmail/{email}": "packages/functions/src/userByEmail.handler",
      "POST /question/create": "packages/functions/src/question.create",
      "GET /question/list": "packages/functions/src/question.list",
      "POST /postcard/create": "packages/functions/src/postcard.create",
      "GET /postcard/list": "packages/functions/src/postcard.list",
      "POST /upload/create": "packages/functions/src/upload.create",
      "GET /upload/list": "packages/functions/src/upload.list",
      "GET /upload/media": "packages/functions/src/upload.media",
      "PUT /upload/update": "packages/functions/src/upload.update",
      "POST /live/create": "packages/functions/src/live.create",
      "GET /live/list": "packages/functions/src/live.list",
    },
  });

  // API PERMISSIONS
  api.attachPermissions("*");

  // API OUTPUTS
  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  return { api };
};
