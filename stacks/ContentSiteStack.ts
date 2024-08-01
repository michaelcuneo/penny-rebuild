import { StackContext, SvelteKitSite, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";
import { TableStack } from "./TableStack";
import { ApiStack } from "./ApiStack";

export function ContentSiteStack({ stack }: StackContext) {
  const { bucket } = use(StorageStack);
  const { api } = use(ApiStack);
  const { uploadsTable } = use(TableStack);

  const contentsite = new SvelteKitSite(stack, "ContentSite", {
    bind: [uploadsTable, bucket],
    path: "packages/content",
    edge: false, // Set to false because we don't need this to be international.
    environment: {
      API_URL: api.url,
    },
  });

  stack.addOutputs({
    ContentsUrl: contentsite.url,
  });
}
