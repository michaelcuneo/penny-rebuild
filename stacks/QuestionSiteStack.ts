import { StackContext, SvelteKitSite, use } from "sst/constructs";
import { TableStack } from "./TableStack";
import { ApiStack } from "./ApiStack";

export function QuestionSiteStack({ stack }: StackContext) {
  const { api } = use(ApiStack);
  const { questionTable } = use(TableStack);

  const questionSite = new SvelteKitSite(stack, "QuestionSite", {
    bind: [questionTable],
    path: "packages/questions",
    edge: false, // Set to false because we don't need this to be international.
    environment: {
      API_URL: api.url,
    },
  });

  stack.addOutputs({
    QuestionsUrl: questionSite.url,
  });
}
