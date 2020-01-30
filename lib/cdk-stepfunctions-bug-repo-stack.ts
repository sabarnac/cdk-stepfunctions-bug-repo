import * as sfn from "@aws-cdk/aws-stepfunctions";
import * as tasks from "@aws-cdk/aws-stepfunctions-tasks";
import * as cdk from "@aws-cdk/core";

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

    new sfn.StateMachine(this, "SampleStateMachine", {
      definition: stepFunctionsTask,
    });
  }
}
