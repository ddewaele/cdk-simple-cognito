# CDK Simple Cognito Stack

This CDK (AWS Cloud Development Kit) project creates an Amazon Cognito User Pool with user groups, custom scopes, and OAuth clients for various authorization flows. The project is written in TypeScript and leverages the AWS CDK library to define and deploy AWS resources.

## Prerequisites

Before getting started, ensure you have the following prerequisites:

1. [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_prerequisites) installed and configured with appropriate AWS credentials.
2. Node.js installed (version 12.x or higher).
3. AWS CLI installed and configured with the necessary credentials.

## Installation

Follow these steps to set up and deploy the project:

1. Clone this repository to your local machine:

   ```bash
   git clone <repository_url>
   cd <repository_directory>
   ```

2. Install project dependencies:

   ```bash
   npm install
   ```

## Usage

To deploy the CDK stack and create the necessary AWS resources, run the following command:

```bash
cdk deploy
```

## Overview

### Deployed Resources

This CDK stack deploys the following AWS resources:

1. **Cognito User Pool**: This is a secure user directory that supports user registration, authentication, and management.

2. **User Groups**: Two user groups, namely "Admin" and "User," are created within the Cognito User Pool. These groups can be used to manage permissions for different user types.

3. **Custom Scopes**: Custom OAuth2.0 scopes ("scope1" and "scope2") are defined for the resource server. These scopes help control access to protected resources and actions.

4. **OAuth Clients**:
   - **Authorization Code Flow Client**: This OAuth client enables the Authorization Code Flow, typically used for web and mobile applications. Users can sign in and obtain access tokens using this client.
   - **Client Credentials Flow Client**: This OAuth client enables the Client Credentials Flow, which is suitable for machine-to-machine communication. It allows non-user entities to obtain access tokens.



To test the authorization code just hook up an application and use your browser.
To use client credentials you can use this snippet here :    


```
CLIENT_ID=xxx
CLIENT_SECRET=yyy
REGION=eu-central-1
USER_POOL_ID=eu-central-1_7s0YJek0R
URL=https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}

curl -X POST 'https://springboot-ecs-test3.auth.eu-central-1.amazoncognito.com/oauth2/token' \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "grant_type=client_credentials" \
-d "client_id=${CLIENT_ID}" \
-d "client_secret=${CLIENT_SECRET}"
```


### How to Use

Here's how you can use the deployed resources:

1. **User Registration and Sign-In**: If `selfSignUpEnabled` is set to `true`, users can register themselves in the Cognito User Pool. They will receive a verification email containing a code for account activation.

2. **User Groups**: Utilize the "Admin" and "User" user groups to manage permissions for different user types. Assign users to these groups to grant or restrict access to specific resources or features in your application.

3. **OAuth Clients**:
   - Use the OAuth client created for the Authorization Code Flow to implement user sign-in and authentication in your web or mobile application. The callback URL for this client is `'http://localhost:8080/login/oauth2/code/cognito'`.
   - Use the OAuth client created for the Client Credentials Flow to enable server-to-server communication or for non-user entity authentication.

4. **Custom Scopes**: Leverage the custom OAuth2.0 scopes ("scope1" and "scope2") to control access to specific API endpoints or resources within your application. Associate these scopes with OAuth clients and configure your application to request them during authentication.

5. **Outputs**: After deploying the CDK stack, you will receive the following outputs:
   - `UserPoolId`: Use this ID to reference the Cognito User Pool in your application.
   - `AuthCodeClientId`: Utilize this ID to configure the OAuth client supporting the Authorization Code Flow.
   - `ClientCredentialsClientId`: Utilize this ID to configure the OAuth client supporting the Client Credentials Flow.

### Configuration

To customize the CDK stack's behavior, modify the parameters in the constructor of the `CdkSimpleCognitoStack` class located in `lib/cdk-simple-cognito-stack.ts`. Key configuration options include:

- `selfSignUpEnabled`: Set to `true` to allow self-registration.
- `emailSubject` and `emailBody`: Customize the email verification subject and body.
- `signInAliases`: Specify the sign-in alias (e.g., email).
- `domainPrefix`: Set a unique domain prefix for the Cognito User Pool.
- `scopes`: Define custom OAuth2.0 scopes for resource access control.
- `callbackUrls`: Specify callback URLs for OAuth clients, particularly for the Authorization Code Flow.

### Additional Information

- This project uses the AWS CDK to define infrastructure as code, simplifying AWS resource management and deployment.
- Ensure that you adhere to AWS best practices for securing your Cognito User Pool and OAuth clients in a production environment.
- Extend this project as needed to integrate Cognito with your application and implement user authentication and authorization features.

For more information on AWS CDK, refer to the [AWS CDK documentation](https://docs.aws.amazon.com/cdk/latest/guide/home.html).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
