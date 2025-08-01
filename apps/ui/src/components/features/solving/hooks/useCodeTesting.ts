import { toaster } from "@/components/ui/toaster";

import type { FullProblem } from "@repo/backend/problems/problemService";
import { usePromiseStore } from "@/stores/usePromiseStore";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/libs/query";


export function useCodeTesting(
  problem: FullProblem,
  selectedLanguageId: string,
  getEditorCode: () => string,
  renewSubmissionId: () => string, 
) {
  const { mutateAsync: testCodeAsync, isPending: isTestingCode } = useMutation(
    trpc.submission.testSubmission.mutationOptions()
  );
  const { mutateAsync: submitSubmission, isPending: isSubmittingCode } =
    useMutation(trpc.submission.createSubmission.mutationOptions()
    );

  const promiseStore = usePromiseStore();

  const handleRunCode = async (type: "test" | "submit") => {
    const code = getEditorCode();
    if (!code) {
      toaster.error({ title: "Vui lòng nhập code " });
      return;
    }

    const language = problem.languages.find(
      (lang) => lang.id.toString() === selectedLanguageId,
    );

    if (!language) {
      toaster.error({ title: "Vui lòng chọn ngôn ngữ lập trình" });
      return;
    }

    const newId = renewSubmissionId();
    const payload = {
      problemId: problem.id,
      languageId: language.id,
      code,
      isTest: type === "test",
      id: newId,
    };
    const func: any = type === "test" ? testCodeAsync : submitSubmission;
    return func(payload)
      .then(() => {
        const promise = new Promise((resolve, reject) => {
          promiseStore.addPending(newId, { resolve, reject }, type);
        });
        toaster.promise(promise, {
          loading: {
            title: type === "test" ? "Đang test code..." : "Đang nộp bài...",
          },
          success: { title: "Code đã pass tất cả testcase" },
          error: (error: any) => ({
            title: "Code không pass tất cả testcase",
            description: error.message || String(error.error || error), 
          }),
        });
        return newId;
      })
      .catch((apiError: any) => {
        toaster.error({
          title: "Lỗi khi gửi code để test",
          description:
            apiError instanceof Error ? apiError.message : String(apiError),
        });
        
        
        
      });
  };

  return {
    handleTestCode: () => handleRunCode("test"),
    handleSubmitCode: () => handleRunCode("submit"),
    isRunningCode: isTestingCode || isSubmittingCode,
  };
}
