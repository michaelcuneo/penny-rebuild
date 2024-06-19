import { Config, StackContext } from "sst/constructs";

export function ConfigStack({ stack }: StackContext) {
  const projectName = new Config.Parameter(stack, 'PROJECT_NAME', {
    value: 'FASTlab Penny'
  });

  const emailService = new Config.Secret(stack, 'EMAIL_SERVICE');
  const emailHost = new Config.Secret(stack, 'EMAIL_HOST');
  const emailPort = new Config.Secret(stack, 'EMAIL_PORT');
  const emailUser = new Config.Secret(stack, 'EMAIL_USER');
  const emailAppPass = new Config.Secret(stack, 'EMAIL_APP_PASS');
  const jwtSecret = new Config.Secret(stack, 'JWT_SECRET');

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
