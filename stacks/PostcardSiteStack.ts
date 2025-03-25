import { StackContext, SvelteKitSite, use } from "sst/constructs";
import { TableStack } from "./TableStack";
import { ApiStack } from "./ApiStack";

export function PostcardSiteStack({ stack }: StackContext) {
  const { api } = use(ApiStack);
  const { postcardTable } = use(TableStack);

  const postcardsite = new SvelteKitSite(stack, "PostcardSite", {
    bind: [postcardTable],
    path: "packages/postcards",
    edge: false, // Set to false because we don't need this to be international.
    environment: {
      API_URL: api.url,
    },
  });

  stack.addOutputs({
    PostcardsUrl: postcardsite.url,
  });
}
