import { createRequire as topLevelCreateRequire } from 'module';const require = topLevelCreateRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// stacks/AuthStack.ts
import { Auth, use as use2 } from "sst/constructs";

// stacks/ApiStack.ts
import { Api, use } from "sst/constructs";

// stacks/TableStack.ts
import { Table } from "sst/constructs";
function TableStack({ stack }) {
  const usersTable = new Table(stack, "Users", {
    fields: { id: "string", email: "string" },
    primaryIndex: { partitionKey: "email" }
  });
  const postcardTable = new Table(stack, "Postcard", {
    fields: {
      id: "string",
      postcardId: "string",
      response: "string"
    },
    primaryIndex: { partitionKey: "id" }
  });
  const questionTable = new Table(stack, "Question", {
    fields: {
      id: "string",
      questionId: "string",
      response: "string"
    },
    primaryIndex: { partitionKey: "id" }
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
      likes: "number"
    },
    primaryIndex: { partitionKey: "id" }
  });
  return { usersTable, postcardTable, questionTable, uploadsTable };
}
__name(TableStack, "TableStack");

// stacks/ConfigStack.ts
import { Config } from "sst/constructs";
function ConfigStack({ stack }) {
  const projectName = new Config.Parameter(stack, "PROJECT_NAME", {
    value: "FASTlab Penny"
  });
  const emailService = new Config.Secret(stack, "EMAIL_SERVICE");
  const emailHost = new Config.Secret(stack, "EMAIL_HOST");
  const emailPort = new Config.Secret(stack, "EMAIL_PORT");
  const emailUser = new Config.Secret(stack, "EMAIL_USER");
  const emailAppPass = new Config.Secret(stack, "EMAIL_APP_PASS");
  const jwtSecret = new Config.Secret(stack, "JWT_SECRET");
  return {
    projectName,
    emailService,
    emailHost,
    emailPort,
    emailUser,
    emailAppPass,
    jwtSecret
  };
}
__name(ConfigStack, "ConfigStack");

// stacks/ApiStack.ts
function ApiStack({ stack }) {
  const { emailService, emailHost, emailPort, emailUser, emailAppPass } = use(ConfigStack);
  const { usersTable, uploadsTable, questionTable, postcardTable } = use(TableStack);
  const api = new Api(stack, "api", {
    cors: {
      allowCredentials: true,
      allowHeaders: ["content-type"],
      allowMethods: ["ANY"],
      allowOrigins: [`http://localhost:3000`, `https://penny.soci.org.au`, "http://localhost:3001", "http://localhost:4172"]
    },
    defaults: {
      function: {
        bind: [
          usersTable,
          uploadsTable,
          questionTable,
          postcardTable,
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
      "POST /user/create": "packages/functions/src/userCreate.handler",
      "GET /user/getUserByEmail/{email}": "packages/functions/src/userByEmail.handler",
      "POST /question/create": "packages/functions/src/question.create",
      "GET /question/list": "packages/functions/src/question.list",
      "POST /postcard/create": "packages/functions/src/postcard.create",
      "GET /postcard/list": "packages/functions/src/postcard.list",
      "POST /upload/create": "packages/functions/src/upload.create",
      "GET /upload/list": "packages/functions/src/upload.list",
      "PUT /upload/update": "packages/functions/src/upload.update"
    }
  });
  api.attachPermissions("*");
  stack.addOutputs({
    ApiEndpoint: api.url
  });
  return { api };
}
__name(ApiStack, "ApiStack");

// stacks/AuthStack.ts
function AuthStack({ stack }) {
  const { api } = use2(ApiStack);
  const { jwtSecret } = use2(ConfigStack);
  const auth = new Auth(stack, "Auth", {
    authenticator: {
      bind: [
        jwtSecret
      ],
      handler: "packages/functions/src/authenticator.handler"
    }
  });
  auth.attach(stack, { api });
  return { auth };
}
__name(AuthStack, "AuthStack");

// stacks/StorageStack.ts
import { Bucket } from "sst/constructs";
function StorageStack({ stack }) {
  const bucket = new Bucket(stack, "public", {
    cors: [
      {
        maxAge: "1 day",
        allowedOrigins: ["*"],
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"]
      }
    ],
    blockPublicACLs: false
  });
  bucket.cdk.bucket.grantPublicAccess();
  return { bucket };
}
__name(StorageStack, "StorageStack");

// stacks/WebsiteStack.ts
import { SvelteKitSite, use as use3 } from "sst/constructs";
function WebsiteStack({ stack }) {
  const { bucket } = use3(StorageStack);
  const { api } = use3(ApiStack);
  const { auth } = use3(AuthStack);
  const { emailService, emailHost, emailPort, emailUser, emailAppPass, jwtSecret } = use3(ConfigStack);
  const { postcardTable, uploadsTable, questionTable, usersTable } = use3(TableStack);
  const contentsite = new SvelteKitSite(stack, "ContentSite", {
    bind: [uploadsTable, bucket],
    path: "packages/content",
    edge: false,
    // Set to false because we don't need this to be international.
    environment: {
      API_URL: api.url
    }
  });
  const questionSite = new SvelteKitSite(stack, "QuestionSite", {
    bind: [questionTable],
    path: "packages/questions",
    edge: false,
    // Set to false because we don't need this to be international.
    environment: {
      API_URL: api.url
    }
  });
  const postcardsite = new SvelteKitSite(stack, "PostcardSite", {
    bind: [postcardTable],
    path: "packages/postcards",
    edge: false,
    // Set to false because we don't need this to be international.
    environment: {
      API_URL: api.url
    }
  });
  const website = new SvelteKitSite(stack, "Website", {
    bind: [auth, usersTable, emailService, emailHost, emailPort, emailUser, emailAppPass, jwtSecret, bucket],
    path: "packages/website",
    edge: false,
    // Set to false because we don't need this to be international.
    environment: {
      API_URL: api.url
    },
    customDomain: {
      domainName: "penny.soci.org.au",
      hostedZone: "soci.org.au"
    }
  });
  stack.addOutputs({
    ContentsUrl: contentsite.url,
    QuestionsUrl: questionSite.url,
    PostcardsUrl: postcardsite.url,
    WebsiteUrl: website.url
  });
}
__name(WebsiteStack, "WebsiteStack");

// sst.config.ts
var sst_config_default = {
  config(_input) {
    return {
      name: "penny-rebuild",
      region: "ap-southeast-2",
      profile: "work"
      // WORK OR PENNY
    };
  },
  stacks(app) {
    app.stack(ConfigStack).stack(TableStack).stack(ApiStack).stack(StorageStack).stack(AuthStack).stack(WebsiteStack);
  }
};
export {
  sst_config_default as default
};
