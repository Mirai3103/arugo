import { executionResultSchema } from "../validations/executionSchema";
import submissionService from "../submissionService";
import { natsClient } from "@/shared/nats/nats-client";
import { EVENT_TYPES } from "@/shared/constants/event-types";

export function startExecutionSubscriber() {
	console.log("startExecutionSubscriber");
	natsClient.subscribe(EVENT_TYPES.SUBMISSION.EXECUTED, (data) => {
		try {
			const result = executionResultSchema.parse(data);
			submissionService.updateResult(result);
			console.log(`Processed submission.result for submission ${result.submissionId}`);
		} catch (err) {
			console.error("Error processing submission.result:", err);
		}
	});
}
