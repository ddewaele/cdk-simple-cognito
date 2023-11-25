import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import { CfnUserPoolGroup, OAuthScope, ResourceServerScope, UserPool, UserPoolClient, UserPoolResourceServer, VerificationEmailStyle } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

// export interface CognitoStackProps extends StackProps {
//   domainPrefix: string;
//   resourceServiceIdentifier: string;
//   resourceServerScopes: ResourceServerScope[];
//   authorizationCodeScopes: OAuthScope[];
//   callBackUrl: string;
// }

export class CdkSimpleCognitoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create a new Cognito User Pool
    const userPool = new UserPool(this, 'UserPool', {
      // User Pool configuration here
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: 'Verify your email for our awesome app!',
        emailBody: 'Thanks for signing up to our awesome app! Your verification code is {####}',
        emailStyle: VerificationEmailStyle.CODE,
      },
      signInAliases: {
        email: true,
      },
    });

    // Create Group 1
    const group1 = new CfnUserPoolGroup(this, 'Admin', {
      groupName: 'ADMIN',
      userPoolId: userPool.userPoolId,
    });

    // Create Group 2
    const group2 = new CfnUserPoolGroup(this, 'User', {
      groupName: 'USER',
      userPoolId: userPool.userPoolId,
    });


    // Add a domain to the User Pool
    userPool.addDomain('CognitoDomain', {
      cognitoDomain: {
        domainPrefix: 'springboot-ecs-test3', // Note: This must be unique across AWS
      },
    });

    // Define a resource server with custom scopes
    const resourceServer = new UserPoolResourceServer(this, 'ResourceServer', {
      identifier: 'test-resource-server1',
      userPool,
      scopes: [
        new ResourceServerScope({
          scopeName: 'scope1',
          scopeDescription: 'Custom scope 1',
        }),
        new ResourceServerScope({
          scopeName: 'scope2',
          scopeDescription: 'Custom scope 2',
        }),
      ],
    });


    // Create App Client for Authorization Code Flow
    const authCodeClient = userPool.addClient('AuthCodeClient', {
      generateSecret: true,
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [OAuthScope.OPENID, OAuthScope.EMAIL, OAuthScope.PROFILE],
        callbackUrls: ['http://localhost:8080/login/oauth2/code/cognito'],
      },
    });

    // Create an App Client for Client Credentials Flow
    const clientCredentialsClient = new UserPoolClient(this, 'ClientCredentialsClient', {
      userPool,
      generateSecret: true, // Client secret is needed
      oAuth: {
        flows: {
          clientCredentials: true,
        },
        scopes: [
          OAuthScope.resourceServer(resourceServer, { scopeName: "scope1", scopeDescription: "scope1" }),
          OAuthScope.resourceServer(resourceServer, { scopeName: "scope2", scopeDescription: "scope2" }),
        ],
      },
    });


    // Output the IDs of the created resources
    new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'AuthCodeClientId', { value: authCodeClient.userPoolClientId });
    new cdk.CfnOutput(this, 'ClientCredentialsClientId', { value: clientCredentialsClient.userPoolClientId });

    // Output client secret - Requires custom resource
    // const clientSecret = new cdk.CfnOutput(this, 'ClientSecret', {
    //   value: clientCredentialsClient.node.tryGetContext('clientSecret'),
    // });

  }
}
