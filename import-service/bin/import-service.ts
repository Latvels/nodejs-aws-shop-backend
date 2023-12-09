#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ImportServiceStack } from '../lib/import-service-stack';
import * as dotenv from 'dotenv';
dotenv.config();
import endpoint from '../endpoints.config';

const app = new cdk.App();
new ImportServiceStack(app, 'ImportServiceStack', { env: { account: endpoint.ACCOUNT, region: endpoint.REGION }});
app.synth();