// src/server.ts
import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server";
import { createRouter } from "./router";
import { initConsumer } from "@repo/backend/index";
console.log("Creating server handler...", process.pid);
initConsumer();
console.log("Server handler created.");
export default createStartHandler({
  createRouter,
})(defaultStreamHandler);
