import {
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiDatabase,
  FiActivity,
  FiAlertTriangle,
  FiRefreshCw,
} from "react-icons/fi";
import { SubmissionTestcaseStatus } from "@/types/enum";
import { SubmissionStatus } from "@repo/backend/submissions/validations/enum";

export const STATUS_CONFIG = {
  [SubmissionTestcaseStatus.Success]: {
    label: "Chấp nhận",
    colorScheme: "green",
    icon: FiCheckCircle,
  },
  [SubmissionTestcaseStatus.WrongAnswer]: {
    label: "Sai kết quả",
    colorScheme: "red",
    icon: FiXCircle,
  },
  [SubmissionTestcaseStatus.TimeLimitExceeded]: {
    label: "Quá thời gian",
    colorScheme: "orange",
    icon: FiClock,
  },
  [SubmissionTestcaseStatus.MemoryLimitExceeded]: {
    label: "Quá bộ nhớ",
    colorScheme: "purple",
    icon: FiDatabase,
  },
  [SubmissionTestcaseStatus.Running]: {
    label: "Đang chấm",
    colorScheme: "blue",
    icon: FiActivity,
    animate: true,
  },
  [SubmissionTestcaseStatus.CompileError]: {
    label: "Lỗi biên dịch",
    colorScheme: "red",
    icon: FiXCircle,
  },
  [SubmissionTestcaseStatus.RuntimeError]: {
    label: "Lỗi thực thi",
    colorScheme: "red",
    icon: FiAlertTriangle,
  },
  [SubmissionTestcaseStatus.None]: {
    label: "Bản nháp",
    colorScheme: "gray",
    icon: FiClock,
  },
  [SubmissionStatus.Failed]: {
    label: "Không thành công",
    colorScheme: "red",
    icon: FiXCircle,
  },
  DEFAULT: {
    label: "Không xác định",
    colorScheme: "gray",
    icon: FiClock,
  },
} as const;

export const TEST_CASE_ICONS = {
  [SubmissionTestcaseStatus.Success]: {
    icon: FiCheckCircle,
    color: "green.500",
  },
  [SubmissionTestcaseStatus.Running]: {
    icon: FiRefreshCw,
    color: "blue.500",
    animate: "spin 1s linear infinite",
  },
  [SubmissionTestcaseStatus.WrongAnswer]: {
    icon: FiXCircle,
    color: "red.500",
  },
  [SubmissionTestcaseStatus.TimeLimitExceeded]: {
    icon: FiClock,
    color: "orange.500",
  },
  [SubmissionTestcaseStatus.MemoryLimitExceeded]: {
    icon: FiDatabase,
    color: "purple.500",
  },
  [SubmissionTestcaseStatus.RuntimeError]: {
    icon: FiAlertTriangle,
    color: "red.500",
  },
  [SubmissionTestcaseStatus.CompileError]: {
    icon: FiXCircle,
    color: "red.500",
  },
  DEFAULT: {
    icon: FiClock,
    color: "gray.400",
  },
} as const;

export const LIMITS = {
  TIME_LIMIT_MS: 200,
  MEMORY_LIMIT_KB: 32 * 1024,
} as const;

export const THEME_COLORS = {
  cardBg: { base: "white", _dark: "gray.800" },
  subduedTextColor: { base: "gray.500", _dark: "gray.400" },
} as const;
