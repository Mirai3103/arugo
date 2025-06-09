import { getSubmissionByIdQueryOptions } from "@/libs/queries/submission";
import { usePromiseStore } from "@/stores/usePromiseStore";
import { SubmissionTestcaseStatus } from "@/types/enum"; // Ensure this path is correct
import { useQuery } from "@tanstack/react-query";
import React from "react";

export function useSubmissionPolling(
  submissionId: string | null,
  _clearSubmissionId: () => void,
) {
  const promiseStore = usePromiseStore();

  const submissionQuery = useQuery({
    // Specify QueryData type
    ...getSubmissionByIdQueryOptions(submissionId || ""),
    enabled: promiseStore.isPending(),
    refetchInterval: 3000,
  });

  React.useEffect(() => {
    if (!submissionQuery.data || !submissionId) return;

    const { status } = submissionQuery.data;
    if (
      status === SubmissionTestcaseStatus.None ||
      status === SubmissionTestcaseStatus.Running
    ) {
      return;
    }

    if (status === SubmissionTestcaseStatus.Success) {
      promiseStore.resolvePending({
        status: "success",
        data: submissionQuery.data,
      });
    } else {
      promiseStore.rejectPending({
        status: "error",
        error: submissionQuery.data?.status, // Or a more descriptive error from submissionQuery.data
      });
    }
  }, [submissionQuery.data, submissionId, promiseStore]);

  return {
    isPolling:
      (submissionQuery.isFetching && !!submissionId) ||
      promiseStore.isPending(),
  };
}
