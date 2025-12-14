import { SSTConfig } from "sst";
import { AuthStack } from "./stacks/AuthStack";
import { ConfigStack } from "./stacks/ConfigStack";
import { ApiStack } from "./stacks/ApiStack";
import { StorageStack } from "./stacks/StorageStack";
import { TableStack } from "./stacks/TableStack";
import { ContentSiteStack } from "./stacks/ContentSiteStack";
import { QuestionSiteStack } from "./stacks/QuestionSiteStack";
import { PostcardSiteStack } from "./stacks/PostcardSiteStack";
import { WebsiteStack } from "./stacks/WebsiteStack";

export default {
  config(_input) {
    return {
      name: "nelly",
      region: "ap-southeast-2",
      profile: "work", // WORK (on halide) OR DEFAULT (on laptop)
    };
  },
  stacks(app) {
    app
      .stack(ConfigStack)
      .stack(TableStack)
      .stack(StorageStack)
      .stack(ApiStack)
      .stack(AuthStack)
      .stack(ContentSiteStack)
      .stack(QuestionSiteStack)
      .stack(PostcardSiteStack)
      .stack(WebsiteStack);
  },
} satisfies SSTConfig;
