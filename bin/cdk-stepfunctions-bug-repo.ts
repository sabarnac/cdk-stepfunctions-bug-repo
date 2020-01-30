#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CdkStepfunctionsBugRepoStack } from '../lib/cdk-stepfunctions-bug-repo-stack';

const app = new cdk.App();
new CdkStepfunctionsBugRepoStack(app, 'CdkStepfunctionsBugRepoStack');
