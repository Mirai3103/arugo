import { SubmissionTestcaseStatus } from "@/types/enum";
import { STATUS_CONFIG, TEST_CASE_ICONS, LIMITS } from "./submissionConstants";

export const getScoreColor = (score: number): string => {
  if (score >= 80) return "green";
  if (score >= 60) return "blue";
  if (score >= 40) return "orange";
  return "red";
};

export const getAvgScore = (scores: number[]): number => {
  if (scores.length === 0) return 0;
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

export const getStatusConfig = (status: SubmissionTestcaseStatus) => {
  return (
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.DEFAULT
  );
};

export const getTestCaseIcon = (status: SubmissionTestcaseStatus) => {
  return (
    TEST_CASE_ICONS[status as keyof typeof TEST_CASE_ICONS] ||
    TEST_CASE_ICONS.DEFAULT
  );
};

export const calculateProgress = (
  status: SubmissionTestcaseStatus,
  passedTestCases: number,
  totalTestCases: number,
): number => {
  if (status === SubmissionTestcaseStatus.Running && totalTestCases > 0) {
    return Math.round(((passedTestCases || 0) / totalTestCases) * 100);
  }
  return status === SubmissionTestcaseStatus.Success ? 100 : 0;
};

export const calculateUsagePercent = (used: number, limit: number): number => {
  return Math.min(100, (used / limit) * 100);
};

export const getTimeUsagePercent = (timeMs: number): number => {
  return calculateUsagePercent(timeMs, LIMITS.TIME_LIMIT_MS);
};

export const getMemoryUsagePercent = (memoryKb: number): number => {
  return calculateUsagePercent(memoryKb, LIMITS.MEMORY_LIMIT_KB / 1024);
};

export const getTestCaseBackgroundColor = (
  status: SubmissionTestcaseStatus,
) => {
  if (status === SubmissionTestcaseStatus.Success) {
    return { _light: "green.50", _dark: "green.800" };
  }

  if (
    [
      SubmissionTestcaseStatus.WrongAnswer,
      SubmissionTestcaseStatus.CompileError,
      SubmissionTestcaseStatus.RuntimeError,
    ].includes(status)
  ) {
    return { _light: "red.50", _dark: "red.800" };
  }

  return { _light: "gray.50", _dark: "gray.700" };
};
