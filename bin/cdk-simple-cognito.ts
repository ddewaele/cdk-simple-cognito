#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkSimpleCognitoStack } from '../lib/cdk-simple-cognito-stack';

const app = new cdk.App();
new CdkSimpleCognitoStack(app, 'CdkSimpleCognitoStack', {});