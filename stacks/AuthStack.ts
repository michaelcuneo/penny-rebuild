import { StackContext, Auth, use } from "sst/constructs";
import { ApiStack } from "./ApiStack";
import { ConfigStack } from "./ConfigStack";

export function AuthStack({ stack }: StackContext) {
  const { api } = use(ApiStack);
  const { jwtSecret } = use(ConfigStack);

  // Define authenticator
  const auth = new Auth(stack, "Auth", {
    authenticator: {
      bind: [jwtSecret],
      handler: "packages/functions/src/authenticator.handler",
    },
  });

  // Attach the authenticator to the stack
  auth.attach(stack, { api });

  return { auth };
}
