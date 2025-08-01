import { startExecutionSubscriber } from "./submissions/consumers/execution-consumer";
export function initConsumer() {
  console.log("Initializing consumer...");
  startExecutionSubscriber();
  console.log("Consumer initialized.");
}
