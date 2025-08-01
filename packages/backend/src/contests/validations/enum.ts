import { z } from "zod";

export enum ContestStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
  CANCELLED = "CANCELLED",
  ARCHIVED = "ARCHIVED",
}
export const contestStatusEnum = z
  .nativeEnum(ContestStatus)
  .describe("Trạng thái của cuộc thi");
