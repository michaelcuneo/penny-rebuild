import { StackContext, SvelteKitSite, use } from "sst/constructs";
import { ConfigStack } from "./ConfigStack";
import { AuthStack } from "./AuthStack";
import { StorageStack } from "./StorageStack";
import { TableStack } from "./TableStack";
import { ApiStack } from "./ApiStack";

export function WebsiteStack({ stack }: StackContext) {
  const { bucket } = use(StorageStack);
  const { api } = use(ApiStack);
  const { auth } = use(AuthStack);
  const { emailService, emailHost, emailPort, emailUser, emailAppPass, jwtSecret } = use(ConfigStack);
  const { postcardTable, uploadsTable, questionTable, usersTable } = use(TableStack);

  const contentsite = new SvelteKitSite(stack, "ContentSite", {
    bind: [uploadsTable, bucket],
    path: "packages/content",
    edge: false, // Set to false because we don't need this to be international.
    environment: {
      API_URL: api.url,
    },
  });

  const questionSite = new SvelteKitSite(stack, "QuestionSite", {
    bind: [questionTable],
    path: "packages/questions",
    edge: false, // Set to false because we don't need this to be international.
    environment: {
      API_URL: api.url,
    },
  });

  const postcardsite = new SvelteKitSite(stack, "PostcardSite", {
    bind: [postcardTable],
    path: "packages/postcards",
    edge: false, // Set to false because we don't need this to be international.
    environment: {
      API_URL: api.url,
    },
  });

  const website = new SvelteKitSite(stack, "Website", {
    bind: [auth, usersTable, emailService, emailHost, emailPort, emailUser, emailAppPass, jwtSecret, bucket],
    path: "packages/website",
    edge: false, // Set to false because we don't need this to be international.
    environment: {
      API_URL: api.url,
    },
    customDomain: {
      domainName: "penny.soci.org.au",
      hostedZone: "soci.org.au"
    }
  });

  if (process.env.SITE === "website") {
    stack.addOutputs({
      WebsiteUrl: website.url
    })
  } else if (process.env.SITE === "content") {
    stack.addOutputs({
      ContentsUrl: contentsite.url
    })
  } else if (process.env.SITE === "questions") {
    stack.addOutputs({
      QuestionsUrl: questionSite.url
    })
  } else if (process.env.SITE === "postcards") {
    stack.addOutputs({
      PostcardsUrl: postcardsite.url
    })
  }
  
  return { website }
}
