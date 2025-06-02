import { Spinner } from "@chakra-ui/react";
import { LuCircle, LuCircleCheck, LuCircleX } from "react-icons/lu";

export enum SubmissionTestcaseStatus {
	Success = "success",
	CompileError = "compile_error",
	RuntimeError = "runtime_error",
	WrongAnswer = "wrong_answer",
	TimeLimitExceeded = "time_limit_exceeded",
	MemoryLimitExceeded = "memory_limit_exceeded",
	Running = "running",
	None = "none",
}

export const SubmissionTestcaseStatusLabel: Record<
	SubmissionTestcaseStatus,
	string
> = {
	[SubmissionTestcaseStatus.Success]: "Thành công",
	[SubmissionTestcaseStatus.CompileError]: "Lỗi biên dịch",
	[SubmissionTestcaseStatus.RuntimeError]: "Lỗi khi chạy",
	[SubmissionTestcaseStatus.WrongAnswer]: "Kết quả sai",
	[SubmissionTestcaseStatus.TimeLimitExceeded]: "Vượt quá thời gian",
	[SubmissionTestcaseStatus.MemoryLimitExceeded]: "Vượt quá bộ nhớ",
	[SubmissionTestcaseStatus.Running]: "Đang chạy",
	[SubmissionTestcaseStatus.None]: "Chưa có kết quả",
};

export const SubmissionTestcaseStatusColor: Record<
	SubmissionTestcaseStatus,
	string
> = {
	[SubmissionTestcaseStatus.Success]: "green", // Thành công
	[SubmissionTestcaseStatus.CompileError]: "orange", // Lỗi biên dịch
	[SubmissionTestcaseStatus.RuntimeError]: "red", // Lỗi khi chạy
	[SubmissionTestcaseStatus.WrongAnswer]: "red", // Kết quả sai
	[SubmissionTestcaseStatus.TimeLimitExceeded]: "yellow", // Vượt quá thời gian
	[SubmissionTestcaseStatus.MemoryLimitExceeded]: "purple", // Vượt quá bộ nhớ
	[SubmissionTestcaseStatus.Running]: "blue", // Đang chạy
	[SubmissionTestcaseStatus.None]: "gray", // Chưa có kết quả
};

export const SubmissionTestcaseStatusIcon = {
	[SubmissionTestcaseStatus.Success]: <LuCircleCheck />,
	[SubmissionTestcaseStatus.CompileError]: <LuCircleX />,
	[SubmissionTestcaseStatus.RuntimeError]: <LuCircleX />,
	[SubmissionTestcaseStatus.WrongAnswer]: <LuCircleX />,
	[SubmissionTestcaseStatus.TimeLimitExceeded]: <LuCircleX />,
	[SubmissionTestcaseStatus.MemoryLimitExceeded]: <LuCircleX />,
	[SubmissionTestcaseStatus.Running]: <Spinner size="xs" />,
	[SubmissionTestcaseStatus.None]: <LuCircle />,
};

export enum SubmissionStatus {
	Success = "success",
	Failed = "failed",
	Running = "running",
	None = "none",
}
