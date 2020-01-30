import * as sfn from "@aws-cdk/aws-stepfunctions";
import * as tasks from "@aws-cdk/aws-stepfunctions-tasks";
import * as cdk from "@aws-cdk/core";
import { StateMachine } from "@aws-cdk/aws-stepfunctions";

export class CdkStepfunctionsBugRepoStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stepFunctionsTask = new sfn.Task(this, "NestedWorkflowTask", {
      task: new tasks.StartExecution(
        sfn.StateMachine.fromStateMachineArn(this, "NestedWorkflowStateMachine", sfn.Data.stringAt("$.dynamicArn")),
        {
          input: {
            "input.$": "$.dynamicInput",
            "AWS_STEP_FUNCTIONS_STARTED_BY_EXECUTION_ID.$": "$$.Execution.Id",
          },
          name: sfn.Data.stringAt("$.dynamicName"),
          integrationPattern: sfn.ServiceIntegrationPattern.SYNC,
        },
      ),
      resultPath: "$.workflowResult",
    })

    const stateMachine = new sfn.StateMachine(this, "SampleStateMachine", {
      definition: stepFunctionsTask,
    });

    UNSAFE__removeBadDefaultPolicyDocumentStatement(stateMachine);
  }
}

const UNSAFE__removeBadDefaultPolicyDocumentStatement = (stateMachine: StateMachine) => {
  const stateMachineDefaultPolicyDocument = (stateMachine.role as any).defaultPolicy.document;
  stateMachineDefaultPolicyDocument.statements = stateMachineDefaultPolicyDocument.statements.filter(
    (statement: any) => statement.action.indexOf("states:StartExecution") === -1,
  );
};