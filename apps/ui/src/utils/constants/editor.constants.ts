export const EDITOR_CONFIG = {
  REFETCH_INTERVAL: 3000,
  DEFAULT_LANGUAGE: "plaintext",
  EDITOR_OPTIONS: {
    minimap: { enabled: false },
  },
} as const;

export const TOAST_MESSAGES = {
  NO_CODE: "Vui lòng nhập code",
  NO_LANGUAGE: "Vui lòng chọn ngôn ngữ lập trình",
  TESTING: "Đang chạy thử code...",
  SUCCESS: "Code đã pass tất cả testcase",
  ERROR: "Code không pass tất cả testcase",
} as const;
