import { StackContext, SvelteKitSite, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";
import { TableStack } from "./TableStack";
import { ApiStack } from "./ApiStack";

export function WebsiteStack({ stack }: StackContext) {
  const { bucket } = use(StorageStack);
  const { api } = use(ApiStack);
  const { contactTable, postcardTable, contentTable, questionTable, usersTable } = use(TableStack);

  const contentsite = new SvelteKitSite(stack, "ContentSite", {
    bind: [contentTable, bucket],
    path: "packages/content",
    edge: false, // Set to false because we don't need this to be international.
    environment: {
      API_URL: api.url,
    }
  });

  const questionSite = new SvelteKitSite(stack, "QuestionSite", {
    bind: [questionTable],
    path: "packages/questions",
    edge: false, // Set to false because we don't need this to be international.
    environment: {
      API_URL: api.url,
    }
  });

  const postcardsite = new SvelteKitSite(stack, "PostcardSite", {
    bind: [postcardTable],
    path: "packages/postcards",
    edge: false, // Set to false because we don't need this to be international.
    environment: {
      API_URL: api.url,
    }
  });

  const website = new SvelteKitSite(stack, "Website", {
    bind: [usersTable, contactTable, bucket],
    path: "packages/website",
    edge: false, // Set to false because we don't need this to be international.
    environment: {
      API_URL: api.url,
    }
  });

  stack.addOutputs({
    contentSiteUrl: contentsite.url,
    questionSiteUrl: questionSite.url,
    postcardSiteUrl: postcardsite.url,
    webSiteUrl: website.url
  })
}
