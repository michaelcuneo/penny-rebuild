import { SSTConfig } from "sst";
import { AuthStack } from "./stacks/AuthStack";
import { ConfigStack } from "./stacks/ConfigStack";
import { ApiStack } from "./stacks/ApiStack";
import { StorageStack } from "./stacks/StorageStack";
import { TableStack } from "./stacks/TableStack";
import { WebsiteStack } from "./stacks/WebsiteStack";

export default {
  config(_input) {
    return {
      name: "penny-rebuild",
      region: "ap-southeast-2",
    };
  },
  stacks(app) {
    app
      .stack(ConfigStack)
      .stack(TableStack)
      .stack(ApiStack)
      .stack(StorageStack)
      .stack(AuthStack)
      .stack(WebsiteStack);
  }
} satisfies SSTConfig;
