import { Config, StackContext } from "sst/constructs";

export function ConfigStack({ stack }: StackContext) {
  const projectName = new Config.Parameter(stack, 'PROJECT_NAME', {
    value: 'FASTlab Penny'
  });
  const devDomainName = new Config.Parameter(stack, 'DEV_DOMAIN_NAME', {
    value: 'localhost:3000'
  });
  const prodDomainName = new Config.Parameter(stack, 'PROD_DOMAIN_NAME', {
    value: 'penny.soci.org.au'
  });
  const hostedZoneName = new Config.Parameter(stack, 'HOSTED_ZONE_NAME', {
    value: 'soci.org.au'
  });
  const apiDomainName = new Config.Parameter(stack, 'API_DOMAIN_NAME', {
    value: 'pennyapi.soci.org.au'
  });

  const emailService = new Config.Secret(stack, 'EMAIL_SERVICE');
  const emailHost = new Config.Secret(stack, 'EMAIL_HOST');
  const emailPort = new Config.Secret(stack, 'EMAIL_PORT');
  const emailUser = new Config.Secret(stack, 'EMAIL_USER');
  const emailAppPass = new Config.Secret(stack, 'EMAIL_APP_PASS');
  const jwtSecret = new Config.Secret(stack, 'JWT_SECRET');

  return {
    projectName,
    devDomainName,
    prodDomainName,
    hostedZoneName,
    emailService,
    emailHost,
    emailPort,
    emailUser,
    emailAppPass,
    apiDomainName,
    jwtSecret
  };
}
