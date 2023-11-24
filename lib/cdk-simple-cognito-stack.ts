import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import { OAuthScope, UserPool, VerificationEmailStyle } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

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

    // Create App Client for Authorization Code Flow
    const authCodeClient = userPool.addClient('AuthCodeClient', {
      oAuth: {
        flows: {
          authorizationCodeGrant: true,
        },
        scopes: [OAuthScope.OPENID, OAuthScope.EMAIL, OAuthScope.PROFILE],
        callbackUrls: ['http://localhost:8080/login/oauth2/code/cognito'],
      },
    });

    // // Create App Client for Client Credentials Flow
    // const clientCredentialsClient = userPool.addClient('ClientCredentialsClient', {
    //   generateSecret: true, // Needed for client credentials flow
    //   oAuth: {
    //     flows: {
    //       clientCredentials: true,
    //     },
    //     scopes: [OAuthScope.COGNITO_ADMIN],
    //   },
    // });

    // Output the IDs of the created resources
    new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'AuthCodeClientId', { value: authCodeClient.userPoolClientId });
    //new cdk.CfnOutput(this, 'ClientCredentialsClientId', { value: clientCredentialsClient.userPoolClientId });
  }
}
